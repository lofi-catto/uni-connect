import { useMessages } from 'hooks/useMessages';

function MessageList({ chatRoomId, userId }) {
  const messages = useMessages(chatRoomId);

  return (
    <div className="message-list-container">
      <ul className="message-list">
        {messages.map((x) => (
          <Message
            key={x.id}
            message={x}
            isOwnMessage={x.sender.id === userId}
          />
        ))}
      </ul>
    </div>
  );
}

function Message({ message, isOwnMessage }) {
  return (
    <li className={['message', isOwnMessage && 'own'].join(' ')}>
      <h4 className="sender">
        {isOwnMessage ? 'You' : message.sender.displayName}
      </h4>
      <div>{message.text}</div>
    </li>
  );
}

export default MessageList;
