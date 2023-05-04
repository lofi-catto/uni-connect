import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from 'pages/Lobby';

describe('Lobby', () => {
  test('Join chat room button is available', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Join Chat Room')).toBeInTheDocument();
  });

  test('switches to the Create Room form when clicking the appropriate button', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby />} />
        </Routes>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Create your own room'));

    expect(screen.getByText('Create New Room')).toBeInTheDocument();
  });
});
