import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import localForage from 'localforage';
import {
  getMessagesByChatRoomRef,
  subscribeToMessagesByChatRoomRef,
  getChatRoomRef,
  getUserRef,
  createMessage,
} from 'services/firestoreUtils';

function ChatRoom() {
  const { chatRoomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    const chatRoomRef = getChatRoomRef(chatRoomId);

    // Fetch messages for the chat room
    const fetchMessages = async () => {
      const messages = await getMessagesByChatRoomRef(chatRoomRef);
      setMessages(messages);
    };
    fetchMessages();

    // Subscribe to messages for the chat room
    const unsubscribe = subscribeToMessagesByChatRoomRef(
      chatRoomRef,
      setMessages
    );
    return () => unsubscribe();
  }, [chatRoomId]);

  const handleNewMessageSubmit = async (event) => {
    event.preventDefault();

    // Get a reference to the chat room
    const chatRoomRef = getChatRoomRef(chatRoomId);

    // get current user id from localforage
    const userId = await localForage.getItem('userId');

    const userRef = getUserRef(userId);

    // Add the new message to the chat room
    await createMessage(newMessageText, userRef, chatRoomRef);

    // Clear the message input
    setNewMessageText('');
  };

  return (
    <div>
      <h1>Chat Room {chatRoomId}</h1>
      {messages.length === 0 ? (
        <p>Loading messages...</p>
      ) : (
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              {message.sender.displayName}: {message.text}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleNewMessageSubmit}>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessageText}
          onChange={(event) => setNewMessageText(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;
