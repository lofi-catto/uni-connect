import { useState } from 'react';
import { useMessages } from 'hooks/useMessages';
import { useTypingUsers } from 'hooks/useTypingUsers';

function MessageList({ chatRoomId, userId }) {
  const [senderColorMap, setSenderColorMap] = useState({});
  const messages = useMessages(chatRoomId);
  const typingUsers = useTypingUsers(chatRoomId, userId);
  let lastSenderId = '';

  return (
    <div className="message-list-container">
      <ul className="message-list">
        {messages.map((x) => {
          // check if sender is the current user
          const isOwnMessage = x.sender.id === userId;
          const senderClassName = isOwnMessage
            ? 'own'
            : `sender-${x.sender.id}`;
          // generate a unique color for the sender
          if (!isOwnMessage && !senderColorMap[x.sender.id]) {
            const randomColor = Math.floor(Math.random() * 16777215).toString(
              16
            );
            const color = `#${randomColor}`;
            setSenderColorMap((prevSenderColorMap) => ({
              ...prevSenderColorMap,
              [x.sender.id]: color,
            }));
          }
          // grouping consecutive messages in to one user
          let displayName = '';
          let margin = 8;
          if (lastSenderId !== x.sender.id || !lastSenderId) {
            if (isOwnMessage) {
              displayName = 'You';
            } else {
              displayName = x.sender.displayName.substring(0, 4);
              margin = 20;
            }
          }
          lastSenderId = x.sender.id;

          return (
            <Message
              key={x.id}
              message={x}
              isOwnMessage={isOwnMessage}
              displayName={displayName}
              margin={margin}
              senderClassName={senderClassName}
              senderColor={senderColorMap[x.sender.id]}
            />
          );
        })}
      </ul>
      {typingUsers.length > 0 && (
        <div>
          {typingUsers.map((user) => user.displayName).join(', ')}{' '}
          {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}
    </div>
  );
}

function Message({
  message,
  isOwnMessage,
  displayName,
  margin,
  senderClassName,
  senderColor,
}) {
  return (
    <li
      style={{ marginBottom: margin, marginTop: margin }}
      className={['message', senderClassName].join(' ')}
    >
      {displayName && (
        <span className="sender" style={{ background: senderColor }}>
          {displayName}
        </span>
      )}
      <div className="text-content">{message.text}</div>
    </li>
  );
}

export default MessageList;
