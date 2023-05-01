import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getMessagesByChatRoomRef,
  getChatRoomRef,
} from 'services/firestoreUtils';

function ChatRoom() {
  const { chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      // Get a reference to the chat room
      const chatRoomRef = getChatRoomRef(chatRoomId);

      // Fetch messages for the chat room
      const messages = await getMessagesByChatRoomRef(chatRoomRef);
      setMessages(messages);
    };

    fetchMessages();
  }, [chatRoomId]);

  console.warn(messages);

  return (
    <div>
      <h1>Chat Room {chatRoomId}</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            {message.sender.displayName}: {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatRoom;
