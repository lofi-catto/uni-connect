import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import localForage from 'localforage';

import { getChatRoomById } from 'services/chatRoom';
import { getUserById } from 'services/user';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';
import RoomTitle from 'components/ChatRoom/RoomTitle';

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
      <RoomTitle chatRoom={chatRoom} user={user} />
      <MessageList chatRoomId={chatRoomId} userId={user.id} />
      <MessageInput chatRoomId={chatRoomId} />
    </div>
  );
}

export default ChatRoom;
