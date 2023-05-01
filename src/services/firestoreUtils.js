import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from 'services/firebaseConfig';

// Initialize Firebase app
const db = getFirestore(firebaseConfig);

async function checkChatRoomExists(roomName) {
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

async function addUser(displayName) {
  try {
    // Add a new document with an automatically generated ID to the users collection
    const docRef = await addDoc(collection(db, 'users'), { displayName });

    return docRef.id;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

async function getChatRoomId(chatRoomName) {
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

export { checkChatRoomExists, addUser, getChatRoomId };
