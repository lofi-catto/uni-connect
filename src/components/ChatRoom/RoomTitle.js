import { LinkButton } from 'components/Button';

function RoomTitle({ chatRoom, user }) {
  return (
    <div className="chat-room-title">
      <LinkButton href={'/'} linkText={'Back to lobby'} />
      <div className="room-info">
        <span>
          <label>Room Code:</label> {chatRoom?.roomCode}
        </span>
        <span>
          <label>Username:</label> {user?.displayName}
        </span>
      </div>
    </div>
  );
}

export default RoomTitle;
