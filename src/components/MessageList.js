import { useMessages } from 'hooks/useMessages';

function MessageList({ chatRoomId }) {
  const messages = useMessages(chatRoomId);

  return (
    <div>
      <ul>
        {messages.map((x) => (
          <Message key={x.id} message={x} />
        ))}
      </ul>
    </div>
  );
}

function Message({ message }) {
  return (
    <li>
      <h4>
        {message.sender.displayName}: {message.text}
      </h4>
    </li>
  );
}

export default MessageList;
