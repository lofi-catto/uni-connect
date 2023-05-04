import React, { useState } from 'react';
import { debounce } from 'lodash';
import { searchMessagesByKeywordAndChatRoom } from 'services/message';
import { FiSearch } from 'react-icons/fi';

function SideBar({ chatRoom, chatRoomId }) {
  const [searchResult, setSearchResult] = useState([]);
  const handleChange = async (event) => {
    const searchKeyword = event.target.value;
    if (searchKeyword) {
      const messages = await searchMessagesByKeywordAndChatRoom(
        searchKeyword,
        chatRoomId
      );
      setSearchResult(messages);
    } else {
      setSearchResult([]);
    }
  };

  const debouncedHandleChange = debounce(handleChange, 1000);

  return (
    <div className="side-bar">
      <div className="room-info">
        <span>
          <label>Room Code:</label> {chatRoom?.roomCode}
        </span>
      </div>
      <div className="search-container">
        <div className="search-input-container">
          <FiSearch size={24} />
          <input
            type="search"
            placeholder="Search messages"
            className="search-input"
            onChange={debouncedHandleChange}
            required
            minLength={1}
          />
          <div className="search-result-container">
            {searchResult.length > 0 && (
              <ul className="search-result-list">
                {searchResult.map((message) => (
                  <li key={message.id}>
                    <div className="sender">{message.sender.displayName}</div>
                    <div className="search-message">{message.text}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
