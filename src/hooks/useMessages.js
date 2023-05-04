import { useState, useEffect } from 'react';
import { getMessagesByChatRoomRef } from 'services/message';
import { getChatRoomRef } from 'services/chatRoom';

export function useMessages(chatRoomId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const chatRoomRef = getChatRoomRef(chatRoomId);

    const unsubscribe = getMessagesByChatRoomRef(chatRoomRef, (messages) => {
      setMessages(messages);
    });

    //unsubscribe from realtime listener
    return () => unsubscribe;
  }, [chatRoomId]);

  return messages;
}
