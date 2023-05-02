import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import localForage from 'localforage';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';

function ChatRoom() {
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    // get current user id from localforage
    const fetchUserId = async () => {
      const userId = await localForage.getItem('userId');
      setUserId(userId);
    };

    fetchUserId();
  }, []);

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
    <div>
      <h1>Chat Room {chatRoomId}</h1>
      <ul>
        <MessageList chatRoomId={chatRoomId} />
      </ul>
      <MessageInput chatRoomId={chatRoomId} />
    </div>
  );
}

export default ChatRoom;
