import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localForage from 'localforage';
import {
  checkChatRoomExists,
  addUser,
  getChatRoomId,
} from 'services/firestoreUtils';
import { ReactComponent as ReactLogo } from 'assets/SVG/monash-logo-mono.svg';

function JoinRoomForm() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [chatRoomName, setChatRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Add a new user to Firestore and join the chat room
  const addUserAndJoinChatRoom = async (e) => {
    e.preventDefault();

    if (!userName) {
      setErrorMessage('User name is required');
      return;
    }

    if (!chatRoomName) {
      setErrorMessage('Chat room name is required');
      return;
    }

    try {
      // Check if chat room exists
      const chatRoomExists = await checkChatRoomExists(chatRoomName);

      if (!chatRoomExists) {
        setErrorMessage('Chat room does not exist');
        return;
      }

      // Add the user to Firestore
      const userId = await addUser(userName);

      //save userId to localForage
      try {
        await localForage.setItem('userId', userId);
      } catch (error) {
        console.log(error);
      }

      // Get the chat room ID
      const chatRoomId = await getChatRoomId(chatRoomName);

      // Navigate to chat room
      navigate(`/chat/${chatRoomId}`);
    } catch (error) {
      setErrorMessage('Error adding user and joining chat room: ', error);
    }
  };

  const handleNameChange = (e) => {
    e.preventDefault();
    setUserName(e.target.value.trim());
    setErrorMessage('');
  };

  const handleRoomNameChange = (e) => {
    e.preventDefault();
    setChatRoomName(e.target.value.trim());
    setErrorMessage('');
  };

  return (
    <form className="login-form" onSubmit={() => false}>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <br />
      <input
        placeholder="Enter Your Name"
        type="text"
        value={userName}
        required
        onChange={handleNameChange}
      />
      <br />
      <input
        placeholder="Enter Chat Room Code"
        type="text"
        value={chatRoomName}
        required
        onChange={handleRoomNameChange}
      />
      <br />
      <button
        className="form-action"
        type="button"
        onClick={addUserAndJoinChatRoom}
      >
        Join Chat Room
      </button>
      <br />
    </form>
  );
}

export default JoinRoomForm;
