import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import localForage from 'localforage';
import { LinkButton } from 'components/Button';

import { getChatRoomById } from 'services/chatRoom';
import { getUserById } from 'services/user';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';
import RoomTitle from 'components/ChatRoom/RoomTitle';
import SideBar from 'components/ChatRoom/SideBar';

function ChatRoom() {
  const { chatRoomId } = useParams();
  const [user, setUser] = useState(false);
  const [chatRoom, setChatRoom] = useState();
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  // TO DO: Improve this loading please
  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user || !chatRoomId) {
    return (
      <div className="error-gate">
        <div className="error-message">
          <h2>Please choose a name to join</h2>
        </div>
        <LinkButton href={'/'} children={<span>Create your user name</span>} />
      </div>
    );
  }

  return (
    <div className="chat-room-container">
      <div className="main-wrapper">
        <RoomTitle chatRoom={chatRoom} user={user} />
        <MessageList chatRoomId={chatRoomId} userId={user.id} />
        <MessageInput chatRoomId={chatRoomId} />
      </div>
      <SideBar chatRoom={chatRoom} />
    </div>
  );
}

export default ChatRoom;
