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
  deleteDoc,
  serverTimestamp,
  collectionGroup,
  onSnapshot,
  orderBy,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import firebaseConfig from 'services/firebaseConfig';

// TODO: Handle errors consistently

// Initialize Firebase app
const db = getFirestore(firebaseConfig);

/* USERS */
export async function addUser(displayName) {
  try {
    const usersRef = collection(db, 'users');
    let newDisplayName = displayName;
    let suffix = 1;

    // Check if the displayName already exists in the database
    let querySnapshot = await getDocs(
      query(usersRef, where('displayName', '==', newDisplayName))
    );

    while (!querySnapshot.empty) {
      // If the displayName already exists, append a unique suffix to it
      suffix++;
      newDisplayName = `${displayName}-${suffix}`;
      querySnapshot = await getDocs(
        query(usersRef, where('displayName', '==', newDisplayName))
      );
    }

    // Add a new document with an automatically generated ID to the users collection
    const docRef = await addDoc(usersRef, { displayName: newDisplayName });

    return docRef.id;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export function getUserRef(userId) {
  return doc(db, 'users', userId);
}

export async function getUserById(userId) {
  try {
    const usersRef = collection(db, 'users');
    const userDoc = await getDoc(doc(usersRef, userId));

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      console.error('No user found with ID:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function isUserDisplayNameExists(displayName) {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(
      query(usersRef, where('displayName', '==', displayName))
    );

    if (!querySnapshot.empty) {
      // If a user with the provided displayName exists, return the ID of the first document in the query snapshot
      return querySnapshot.docs[0].id;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error checking if display name exists:', error);
    throw error;
  }
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
