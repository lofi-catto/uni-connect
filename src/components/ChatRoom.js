import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import localForage from 'localforage';
import {
  getChatRoomRef,
  getUserRef,
  createMessage,
} from 'services/firestoreUtils';
import MessageList from 'components/MessageList';

function ChatRoom() {
  const { chatRoomId } = useParams();
  const [newMessageText, setNewMessageText] = useState('');

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
      <ul>
        <MessageList chatRoomId={chatRoomId} />
      </ul>
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
