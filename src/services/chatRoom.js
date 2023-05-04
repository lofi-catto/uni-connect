import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import firebaseConfig from 'services/firebaseConfig';
import { getUserById } from 'services/user';

// Initialize Firebase app
const db = getFirestore(firebaseConfig);

export async function getChatRoomId(chatRoomCode) {
  try {
    const q = query(
      collection(db, 'chatRooms'),
      where('roomCode', '==', chatRoomCode.toUpperCase())
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

export async function checkChatRoomExists(roomCode) {
  // Query the chatRooms collection for a document with the matching name
  return getDocs(
    query(
      collection(db, 'chatRooms'),
      where('roomCode', '==', roomCode.toUpperCase())
    )
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

export async function createChatRoom(name, count = 0) {
  const chatRoomsRef = collection(db, 'chatRooms');

  // Generate a random 4-character string
  const randomString = Math.random().toString(36).substr(2, 4).toUpperCase();

  // Extract the first four characters of the name string
  const nameString = name.substring(0, 4).toUpperCase();

  // Combine the two strings to form the room code
  const roomCode = nameString + randomString;

  // Check if the generated room code already exists
  const querySnapshot = await getDocs(
    query(chatRoomsRef, where('roomCode', '==', roomCode))
  );

  if (!querySnapshot.empty) {
    // If the room code already exists, generate a new one recursively
    if (count >= 10) {
      // Limit the number of recursive calls to 10
      throw new Error('Unable to generate a unique room code');
    }
    return createChatRoom(name, count + 1);
  }

  // Create a new chat room document with the unique room code
  const newChatRoomRef = await addDoc(chatRoomsRef, {
    name,
    roomCode,
    typingUsers: [],
  });

  return newChatRoomRef.id;
}

export async function addTypingUserToChatRoom(userId, chatRoomId) {
  try {
    const chatRoomRef = getChatRoomRef(chatRoomId);

    await updateDoc(chatRoomRef, {
      typingUsers: arrayUnion(userId),
    });
  } catch (error) {
    console.error('Error adding user to typingUsers:', error);
    throw error;
  }
}

export async function removeUserFromTypingUsers(userId, chatRoomId) {
  try {
    const chatRoomRef = getChatRoomRef(chatRoomId);

    await updateDoc(chatRoomRef, {
      typingUsers: arrayRemove(userId),
    });
  } catch (error) {
    console.error('Error removing user from typingUsers:', error);
    throw error;
  }
}

export function getTypingUsersByChatRoomId(chatRoomId, callback) {
  const chatRoomRef = doc(db, 'chatRooms', chatRoomId);

  return onSnapshot(chatRoomRef, async (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const typingUserIds = data.typingUsers || [];

      // Fetch user data for each typing user
      const typingUsers = await Promise.all(
        typingUserIds.map(async (userId) => {
          const user = await getUserById(userId);
          return user ? { id: user.id, ...user } : null;
        })
      );

      callback(typingUsers.filter((user) => user !== null));
    }
  });
}
