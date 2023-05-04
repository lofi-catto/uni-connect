import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

function SideBar({ chatRoom }) {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = async (event) => {
    setSearchValue(event.target.value);
  };

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
            type="text"
            placeholder="Search messages"
            className="search-input"
            value={searchValue}
            onChange={handleChange}
            required
            minLength={1}
          />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
