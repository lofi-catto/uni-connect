import { LinkButton } from 'components/Button';
import { BiChevronLeft } from 'react-icons/bi';

function RoomTitle({ chatRoom, user }) {
  return (
    <div className="chat-room-title">
      <LinkButton
        href={'/'}
        children={
          <div className="back-btn">
            <BiChevronLeft size={24} /> Back
          </div>
        }
      />

      <div className="user-info">
        <span>
          <label>Username:</label> {user?.displayName}
        </span>
        <span className="room-code">
          <label>Room Code:</label> {chatRoom?.roomCode}
        </span>
      </div>
    </div>
  );
}

export default RoomTitle;
