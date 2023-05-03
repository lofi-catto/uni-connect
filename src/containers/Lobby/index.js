import React, { useEffect, useState } from 'react';
import { JoinRoomForm, CreateRoomForm } from 'components/Forms';
import { TextButton } from 'components/Button';
import { ReactComponent as ReactLogo } from 'assets/SVG/monash-logo-mono.svg';

function Lobby() {
  const [isCreateState, setIsCreateState] = useState(false);

  return (
    <div className="login-container">
      <ReactLogo className="logo" />
      <h1>Monash Connect</h1>
      {isCreateState ? <CreateRoomForm /> : <JoinRoomForm />}
      <br />
      {isCreateState ? (
        <TextButton
          buttonText={'Join an existing room'}
          onClick={() => setIsCreateState(false)}
        />
      ) : (
        <TextButton
          buttonText={'Create your own room'}
          onClick={() => setIsCreateState(true)}
        />
      )}
    </div>
  );
}

export default Lobby;
