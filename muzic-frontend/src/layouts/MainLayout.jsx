import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Player from '../components/Player';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Library from '../pages/Library';
import Login from '../pages/Login';
import Artists from '../pages/Artists';
import ArtistDetail from '../pages/ArtistDetail';
import Genres from '../pages/Genres';
import GenreDetail from '../pages/GenreDetail';
import History from '../pages/History';
import Ranking from '../pages/Ranking';

export default function MainLayout() {
  const [user, setUser] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [search, setSearch] = useState('');
  const [favoritesReloadKey, setFavoritesReloadKey] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentSong(null);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSong(null);
  };

  const reloadFavorites = () => setFavoritesReloadKey(k => k + 1);

  const handleSetCurrentSong = (song) => {
    setCurrentSong(song);
    const index = playlist.findIndex(s => s._id === song._id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  const handleUpdatePlaylist = (songs) => {
    setPlaylist(songs);
    if(currentSong && !songs.some(s => s._id === currentSong._id)){
      setCurrentSong(null);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
      background: 'linear-gradient(120deg, #232526 0%, #191414 60%, #1db954 100%)'
    }}>
      <Header
        user={user}
        search={search}
        setSearch={setSearch}
        onLogout={handleLogout}
      />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {!(user && user.username === 'admin') && <Sidebar user={user} />}
        <Box sx={{ 
          flex: 1, 
          bgcolor: 'linear-gradient(120deg, #232526 0%, #191414 60%, #1db954 100%)',
          minHeight: 'calc(100vh - 64px)', 
          p: 3, 
          overflow: 'auto',
          border: 'none',
          boxShadow: 'none',
        }}>
          <Routes>
            <Route path="/" element={
              <Home 
                user={user} 
                setCurrentSong={handleSetCurrentSong} 
                search={search}
                onUpdatePlaylist={handleUpdatePlaylist}
              />
            } />
            <Route path="/library" element={
              <Library 
                user={user} 
                setCurrentSong={handleSetCurrentSong} 
                reloadFavorites={reloadFavorites} 
                favoritesReloadKey={favoritesReloadKey}
                onUpdatePlaylist={handleUpdatePlaylist}
              />
            } />
            <Route path="/history" element={
              <History 
                user={user} 
                setCurrentSong={handleSetCurrentSong}
                onUpdatePlaylist={handleUpdatePlaylist}
              />
            } />
            <Route path="/ranking" element={
              <Ranking
                user={user}
                setCurrentSong={handleSetCurrentSong}
                onUpdatePlaylist={handleUpdatePlaylist}
              />
            } />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:artistName" element={
              <ArtistDetail 
                setCurrentSong={handleSetCurrentSong}
                onUpdatePlaylist={handleUpdatePlaylist}
              />
            } />
            <Route path="/genres" element={<Genres />} />
            <Route path="/genre/:genreName" element={
              <GenreDetail 
                setCurrentSong={handleSetCurrentSong}
                onUpdatePlaylist={handleUpdatePlaylist}
              />
            } />
          </Routes>
        </Box>
      </Box>
      <Player 
        song={currentSong} 
        user={user} 
        reloadFavorites={reloadFavorites}
        playlist={playlist}
        currentIndex={currentIndex}
        setCurrentSong={handleSetCurrentSong}
      />
    </Box>
  );
} 