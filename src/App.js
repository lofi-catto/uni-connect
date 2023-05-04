import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChatRoom from 'pages/ChatRoom';
import Lobby from 'pages/Lobby';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/chat/:chatRoomId" element={<ChatRoom />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
