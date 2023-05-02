import { useState, useEffect } from 'react';
import {
  getMessagesByChatRoomRef,
  getChatRoomRef,
} from 'services/firestoreUtils';

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
