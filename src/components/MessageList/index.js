import { useMessages } from 'hooks/useMessages';
import { useTypingUsers } from 'hooks/useTypingUsers';

function MessageList({ chatRoomId, userId }) {
  const messages = useMessages(chatRoomId);
  // remove current user
  const typingUsers = useTypingUsers(chatRoomId, userId);
  let lastSenderId = '';

  return (
    <div className="message-list-container">
      <ul className="message-list">
        {messages.map((x) => {
          // check if sender is the current user
          const isOwnMessage = x.sender.id === userId;
          // grouping consecutive messages in to one user
          let displayName = '';
          if (lastSenderId !== x.sender.id || !lastSenderId) {
            if (isOwnMessage) {
              displayName = 'You';
            } else {
              displayName = x.sender.displayName;
            }
          }
          lastSenderId = x.sender.id;

          return (
            <Message
              key={x.id}
              message={x}
              isOwnMessage={isOwnMessage}
              displayName={displayName}
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

function Message({ message, isOwnMessage, displayName }) {
  return (
    <li className={['message', isOwnMessage ? 'own' : ''].join(' ')}>
      <h4 className="sender">{displayName}</h4>
      <div>{message.text}</div>
    </li>
  );
}

export default MessageList;
