import { useState } from 'react';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  where,
  query,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../services/firebase';

// Initialize Firebase app
const db = getFirestore(firebaseConfig);

function Lobby() {
  const [userName, setUserName] = useState('');
  const [chatRoomName, setChatRoomName] = useState('');
  const [chatRoomExists, setChatRoomExists] = useState(false);

  // Check if the chat room exists
  const checkChatRoomExists = async () => {
    try {
      const q = query(
        collection(db, 'chatRooms'),
        where('name', '==', chatRoomName)
      );
      const querySnapshot = await getDocs(q);
      setChatRoomExists(!querySnapshot.empty);
    } catch (error) {
      console.error('Error checking chat room existence: ', error);
    }
  };

  // Add a new user to Firestore and join the chat room
  const addUserAndJoinChatRoom = async (e) => {
    e.preventDefault();

    try {
      // Check if chat room exists
      await checkChatRoomExists();

      if (!chatRoomExists) {
        alert('Chat room does not exist');
        return;
      }

      // Add the user to Firestore
      const userRef = await addDoc(collection(db, 'users'), {
        displayName: userName,
      });

      // Get the chat room ID
      const q = query(
        collection(db, 'chatRooms'),
        where('name', '==', chatRoomName)
      );
      const querySnapshot = await getDocs(q);
      const chatRoomId = querySnapshot.docs[0].id;

      // Add the user to the chat room
      const chatRoomUserRef = collection(db, `chatRooms/${chatRoomId}/users`);
      await setDoc(doc(chatRoomUserRef, userRef.id), { user: userRef });

      // Navigate to chat room
      window.location.href = `/chat/${chatRoomId}`;
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
