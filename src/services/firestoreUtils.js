import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  collectionGroup,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from 'services/firebaseConfig';

// TODO: Handle errors consistently

// Initialize Firebase app
const db = getFirestore(firebaseConfig);

/* USERS */
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

export function getUserRef(userId) {
  return doc(db, 'users', userId);
}

export async function deleteUser(userId) {
  try {
    const userRef = getUserRef(userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
}

/* MESSAGES */

export function getMessagesByChatRoomRef(chatRoomRef, callback) {
  const messagesRef = collectionGroup(db, 'messages');

  return onSnapshot(
    query(
      messagesRef,
      where('chatRoom', '==', chatRoomRef),
      orderBy('timestamp', 'asc')
    ),
    async (querySnapshot) => {
      const messages = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const senderRef = data.sender;
          const senderId = senderRef.id;
          const senderDoc = await getDoc(senderRef);
          const senderData = senderDoc.data();
          const senderDisplayName = senderData.displayName;

          return {
            id: doc.id,
            text: data.text,
            timestamp: data.timestamp,
            sender: { id: senderId, displayName: senderDisplayName },
          };
        })
      );

      callback(messages);
    }
  );
}

export async function createMessage(text, senderRef, chatRoomRef) {
  const messagesRef = collection(db, 'messages');
  const newMessageRef = await addDoc(messagesRef, {
    text,
    sender: senderRef,
    chatRoom: chatRoomRef,
    timestamp: serverTimestamp(),
  });
  return newMessageRef.id;
}

/* CHAT ROOM */

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

export async function getChatRoomById(chatRoomId) {
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
  const chatRoomSnapshot = await getDoc(chatRoomRef);
  if (chatRoomSnapshot.exists()) {
    return chatRoomSnapshot.data();
  } else {
    throw new Error(`Chat room with ID ${chatRoomId} does not exist`);
  }
}

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

export async function createChatRoom(name) {
  const chatRoomsRef = collection(db, 'chatRooms');

  const chatRoomExists = await checkChatRoomExists(name);
  if (chatRoomExists) {
    return new Error(
      'Chat room with this name already exists, please use the join button'
    );
  }

  // Create a new chat room document
  const newChatRoomRef = await addDoc(chatRoomsRef, { name });

  return newChatRoomRef.id;
}
