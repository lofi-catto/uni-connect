import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localForage from 'localforage';
import { createChatRoom } from 'services/chatRoom';
import { addUser, deleteUser } from 'services/user';

function CreateRoomForm() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [chatRoomName, setChatRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const createRoom = async (e) => {
    e.preventDefault();

    if (!userName) {
      setErrorMessage('User name is required');
      return;
    }

    if (!chatRoomName) {
      setErrorMessage('Chat room name is required');
      return;
    }

    let userId;
    try {
      userId = await addUser(userName);

      //save userId to localForage
      try {
        await localForage.setItem('userId', userId);
      } catch (error) {
        console.log(error);
      }

      if (!userId) {
        setErrorMessage('Failed to create user');
        return;
      }

      const chatRoomId = await createChatRoom(chatRoomName);

      // if (chatRoomId instanceof Error) {
      //   deleteUser(userId);
      //   setErrorMessage(chatRoomId.message);
      //   return;
      // }

      navigate(`/chat/${chatRoomId}`);
    } catch (error) {
      console.error(error);
      deleteUser(userId);
      setErrorMessage('Failed to create chat room');
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
    <form id="create-room-form" className="lobby-form" onSubmit={createRoom}>
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
        placeholder="Enter Chat Room Name"
        type="text"
        value={chatRoomName}
        required
        onChange={handleRoomNameChange}
      />
      <br />
      <button className="form-action create" type="submit" onClick={createRoom}>
        Create New Room
      </button>
      <br />
    </form>
  );
}

export default CreateRoomForm;
