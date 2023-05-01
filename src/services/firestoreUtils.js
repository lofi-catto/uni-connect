import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDocs,
  doc,
  getDoc,
  collectionGroup,
} from 'firebase/firestore';
import firebaseConfig from 'services/firebaseConfig';

// Initialize Firebase app
const db = getFirestore(firebaseConfig);

export async function checkChatRoomExists(roomName) {
  // Query the chatRooms collection for a document with the matching name
  return getDocs(
    query(collection(db, 'chatRooms'), where('name', '==', roomName))
  )
    .then((querySnapshot) => {
      // Return true if a document exists with the matching name, false otherwise
      return !querySnapshot.empty;
    })
    .catch((error) => {
      console.error('Error checking chat room:', error);
      throw error;
    });
}

export async function addUser(displayName) {
  try {
    // Add a new document with an automatically generated ID to the users collection
    const docRef = await addDoc(collection(db, 'users'), { displayName });

    return docRef.id;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export async function getChatRoomId(chatRoomName) {
  try {
    const q = query(
      collection(db, 'chatRooms'),
      where('name', '==', chatRoomName)
    );
    const querySnapshot = await getDocs(q);
    const chatRoomId = querySnapshot.docs[0].id;
    return chatRoomId;
  } catch (error) {
    console.error('Error getting chat room ID:', error);
    throw error;
  }
}

export function getChatRoomRef(chatRoomId) {
  return doc(db, 'chatRooms', chatRoomId);
}

export async function getMessagesByChatRoomRef(chatRoomRef) {
  const messagesRef = collectionGroup(db, 'messages');
  const q = query(messagesRef, where('chatRoom', '==', chatRoomRef));

  const querySnapshot = await getDocs(q);

  const messages = [];

  for (const doc of querySnapshot.docs) {
    const messageData = doc.data();
    const senderRef = messageData.sender;

    // Fetch the user document for the sender reference
    const senderDoc = await getDoc(senderRef);
    const senderData = senderDoc.data();

    // Convert the sender field to readable object
    const sender = {
      id: senderDoc.id,
      displayName: senderData.displayName,
    };

    // Convert the timestamp field to a Date object
    const timestamp = messageData.timestamp.toDate();

    // Add the message object to the messages array
    messages.push({
      id: doc.id,
      text: messageData.text,
      sender,
      timestamp,
    });
  }

  return messages;
}
