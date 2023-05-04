import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDoc,
  getDocs,
  doc,
  limit,
  serverTimestamp,
  collectionGroup,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from 'services/firebaseConfig';

// Initialize Firebase app
const db = getFirestore(firebaseConfig);

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
  const words = text.trim().split(/\s+/); // Split text into array of words
  const newMessageRef = await addDoc(messagesRef, {
    text,
    sender: senderRef,
    chatRoom: chatRoomRef,
    timestamp: serverTimestamp(),
    words: words.map((word) => word.toLowerCase()), // Store lowercase versions of words in array
  });
  return newMessageRef.id;
}

export async function searchMessagesByKeywordAndChatRoom(keyword, chatRoomId) {
  try {
    const messagesRef = collection(db, 'messages');
    const chatRoomRef = doc(db, 'chatRooms', chatRoomId);

    const querySnapshot = await getDocs(
      query(
        messagesRef,
        where('chatRoom', '==', chatRoomRef),
        where('words', 'array-contains', keyword.toLowerCase())
      )
    );

    const messages = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const message = {
          id: doc.id,
          ...doc.data(),
        };

        // Fetch the sender document using its reference
        const senderSnapshot = await getDoc(message.sender);
        if (senderSnapshot.exists()) {
          message.sender = {
            id: senderSnapshot.id,
            ...senderSnapshot.data(),
          };
        }

        return message;
      })
    );

    return messages;
  } catch (error) {
    console.error('Error searching messages by keyword and chat room:', error);
    throw error;
  }
}
