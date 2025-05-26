import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Player from '../components/Player';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Library from '../pages/Library';
import Login from '../pages/Login';

export default function MainLayout({ role, setRole, ...props }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [search, setSearch] = useState('');
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header
        role={role}
        setRole={setRole}
        search={search}
        setSearch={setSearch}
        onLogout={() => setRole(null)}
        onSelectRole={setRole}
      />
      <Box sx={{ display: 'flex', flex: 1 }}>
        {role !== 'admin' && <Sidebar role={role} setRole={setRole} {...props} />}
        <Box sx={{ flex: 1, bgcolor: 'transparent', minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<Home role={role} setCurrentSong={setCurrentSong} search={search} />} />
            <Route path="/library" element={<Library role={role} setCurrentSong={setCurrentSong} />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
      </Box>
      <Player song={currentSong} />
    </Box>
  );
} 