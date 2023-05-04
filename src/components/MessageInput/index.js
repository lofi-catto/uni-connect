import React, { useState } from 'react';
import { debounce } from 'lodash';
import localForage from 'localforage';
import {
  getChatRoomRef,
  getUserRef,
  createMessage,
  addTypingUserToChatRoom,
  removeUserFromTypingUsers,
} from 'services/firestoreUtils';

function MessageInput({ chatRoomId }) {
  const [newMessageText, setNewMessageText] = useState('');

  const handleChange = async (event) => {
    setNewMessageText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== 'Escape') {
      handleTypingStart();
    }
  };

  const handleKeyUp = (event) => {
    if (event.key !== 'Enter' && event.key !== 'Escape') {
      handleTypingStop();
    }
  };

  const handleTypingStart = async () => {
    const userId = await localForage.getItem('userId');
    if (!userId) {
      return;
    }

    // Add the user to the typingUsers array
    addTypingUserToChatRoom(userId, chatRoomId);
  };

  const handleTypingStop = async () => {
    const userId = await localForage.getItem('userId');
    if (!userId) {
      return;
    }
    removeUserFromTypingUsers(userId, chatRoomId);
  };

  // scroll to the latest message on submit
  const scrollMessageListToBottom = () => {
    const messageListContainer = document.getElementsByClassName(
      'message-list-container'
    )[0];
    if (messageListContainer) {
      messageListContainer.scroll({
        top: messageListContainer.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleNewMessageSubmit = async (event) => {
    event.preventDefault();

    // Get a reference to the chat room
    const chatRoomRef = getChatRoomRef(chatRoomId);

    // Get the current user ID from localforage
    const userId = await localForage.getItem('userId');

    if (!userId) {
      return;
    }

    const userRef = getUserRef(userId);

    // Add the new message to the chat room
    await createMessage(newMessageText, userRef, chatRoomRef);

    // Clear the message input
    setNewMessageText('');

    //scroll to bottom
    scrollMessageListToBottom();
  };

  const debouncedHandleKeyDown = debounce(handleKeyDown, 2000);
  const debouncedHandleKeyUp = debounce(handleKeyUp, 5000);

  return (
    <form onSubmit={handleNewMessageSubmit} className="message-input-container">
      <input
        type="text"
        placeholder="Enter a message"
        className="message-input"
        value={newMessageText}
        onChange={handleChange}
        onKeyDown={debouncedHandleKeyDown}
        onKeyUp={debouncedHandleKeyUp}
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
