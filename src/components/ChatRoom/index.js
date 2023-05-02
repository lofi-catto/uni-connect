import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import localForage from 'localforage';

import { getChatRoomById } from 'services/firestoreUtils';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';

function ChatRoom() {
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  const [userId, setUserId] = useState(false);
  const [chatRoom, setChatRoom] = useState();

  useEffect(() => {
    // get current user id from localforage
    const fetchUserId = async () => {
      const userId = await localForage.getItem('userId');
      setUserId(userId);
    };

    const fetchChatRoom = async () => {
      // Get a reference to the chat room
      const chatRoom = await getChatRoomById(chatRoomId);
      setChatRoom(chatRoom);
    };

    fetchUserId();
    fetchChatRoom();
  }, [chatRoomId]);

  if (!userId || !chatRoomId) {
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
        <Link to="/">Back to lobby</Link>
        <h2>Room Code: {chatRoom?.name}</h2>
      </div>
      <ul>
        <MessageList chatRoomId={chatRoomId} userId={userId} />
      </ul>
      <MessageInput chatRoomId={chatRoomId} />
    </div>
  );
}

export default ChatRoom;
