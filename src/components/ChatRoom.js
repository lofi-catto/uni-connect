import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import firebaseConfig from 'services/firebaseConfig';

// Initialize Firebase app
const db = getFirestore(firebaseConfig);

function ChatRoom() {
  const { chatRoomId } = useParams();

  // Subscribe to messages in the chat room
  const chatRoomMessagesRef = collection(
    db,
    `chatRooms/${chatRoomId}/messages`
  );
  const messagesQuery = query(chatRoomMessagesRef, orderBy('timestamp'));
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data());
      setMessages(messages);
    });

    return () => {
      unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div>
      <h1>Chat Room {chatRoomId}</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChatRoom;
