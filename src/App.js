import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChatRoom from 'containers/ChatRoom';
import Lobby from 'containers/Lobby';

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
