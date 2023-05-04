import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDoc,
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
  const newMessageRef = await addDoc(messagesRef, {
    text,
    sender: senderRef,
    chatRoom: chatRoomRef,
    timestamp: serverTimestamp(),
  });
  return newMessageRef.id;
}
