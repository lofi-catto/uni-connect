import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localForage from 'localforage';
import {
  checkChatRoomExists,
  addUser,
  getChatRoomId,
} from 'services/firestoreUtils';

function Lobby() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [chatRoomName, setChatRoomName] = useState('');

  // Add a new user to Firestore and join the chat room
  const addUserAndJoinChatRoom = async (e) => {
    e.preventDefault();

    try {
      // Check if chat room exists
      const chatRoomExists = await checkChatRoomExists(chatRoomName);

      if (!chatRoomExists) {
        alert('Chat room does not exist');
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
      console.error('Error adding user and joining chat room: ', error);
    }
  };

  return (
    <div>
      <h1>Join a chat room</h1>
      <form onSubmit={addUserAndJoinChatRoom}>
        <label>
          Name:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Chat room code:
          <input
            type="text"
            value={chatRoomName}
            onChange={(e) => setChatRoomName(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Join Chat Room</button>
      </form>
    </div>
  );
}

export default Lobby;
