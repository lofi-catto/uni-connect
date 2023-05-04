import { useEffect, useState } from 'react';
import { getTypingUsersByChatRoomId } from 'services/chatRoom';

export function useTypingUsers(chatRoomId, userId) {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = getTypingUsersByChatRoomId(
      chatRoomId,
      (typingUsers) => {
        setTypingUsers(typingUsers.filter((user) => user.id !== userId));
      }
    );

    return () => {
      unsubscribe();
    };
  }, [chatRoomId, userId]);

  return typingUsers;
}
