import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Player from '../components/Player';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Library from '../pages/Library';

export default function MainLayout({ role, setRole, ...props }) {
  const [currentSong, setCurrentSong] = useState(null);
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Header luôn hiển thị */}
      <Header
        role={role}
        setRole={setRole}
        onLogout={() => setRole(null)}
        onSelectRole={setRole}
      />
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar chỉ hiện nếu không phải admin */}
        {role !== 'admin' && <Sidebar role={role} setRole={setRole} {...props} />}
        <Box sx={{ flex: 1, bgcolor: 'transparent', minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<Home role={role} setCurrentSong={setCurrentSong} />} />
            <Route path="/search" element={<Search role={role} />} />
            <Route path="/library" element={<Library role={role} />} />
          </Routes>
        </Box>
      </Box>
      <Player song={currentSong} />
    </Box>
  );
} 