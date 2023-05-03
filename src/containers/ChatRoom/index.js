import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import localForage from 'localforage';

import { getChatRoomById, getUserById } from 'services/firestoreUtils';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';
import { LinkButton } from 'components/Button';

function ChatRoom() {
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  const [user, setUser] = useState(false);
  const [chatRoom, setChatRoom] = useState();

  useEffect(() => {
    // get current user id from localforage
    const fetchUserId = async () => {
      const userId = await localForage.getItem('userId');
      if (userId) {
        const user = await getUserById(userId);
        setUser(user);
      }
    };

    const fetchChatRoom = async () => {
      // Get a reference to the chat room
      const chatRoom = await getChatRoomById(chatRoomId);
      setChatRoom(chatRoom);
    };

    fetchUserId();
    fetchChatRoom();
  }, [chatRoomId]);

  if (!user || !chatRoomId) {
    return (
      <div>
        <h2>Please go back and choose a name</h2>
        <button
          onClick={() => {
            navigate('/');
          }}
        >
          Leave
        </button>
      </div>
    );
  }

  return (
    <div className="chat-room-container">
      <div className="chat-room-title">
        <LinkButton href={'/'} linkText={'Back to lobby'} />
        <div className="room-info">
          <span>
            <label>Room Code:</label> {chatRoom?.roomCode}
          </span>
          <span>
            <label>Username:</label> {user?.displayName}
          </span>
        </div>
      </div>
      <MessageList chatRoomId={chatRoomId} userId={user.id} />
      <MessageInput chatRoomId={chatRoomId} />
    </div>
  );
}

export default ChatRoom;