import React, { useState } from 'react';
import localForage from 'localforage';
import {
  getChatRoomRef,
  getUserRef,
  createMessage,
} from 'services/firestoreUtils';

function MessageInput({ chatRoomId }) {
  const [newMessageText, setNewMessageText] = useState('');

  const handleChange = (event) => {
    setNewMessageText(event.target.value);
  };

  const handleNewMessageSubmit = async (event) => {
    event.preventDefault();

    // Get a reference to the chat room
    const chatRoomRef = getChatRoomRef(chatRoomId);

    // get current user id from localforage
    const userId = await localForage.getItem('userId');

    if (!userId) {
      return;
    }

    const userRef = getUserRef(userId);

    // Add the new message to the chat room
    await createMessage(newMessageText, userRef, chatRoomRef);

    // Clear the message input
    setNewMessageText('');
  };

  return (
    <form onSubmit={handleNewMessageSubmit} className="message-input-container">
      <input
        type="text"
        placeholder="Enter a message"
        className="message-input"
        value={newMessageText}
        onChange={handleChange}
        required
        minLength={1}
      />
      <button type="submit" disabled={!newMessageText} className="send-message">
        Send
      </button>
    </form>
  );
}

export default MessageInput;
