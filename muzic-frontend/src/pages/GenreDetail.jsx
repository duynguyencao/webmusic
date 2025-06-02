import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

export default function GenreDetail({ setCurrentSong, onUpdatePlaylist }) {
  const { genreName } = useParams();
  const [songs, setSongs] = useState([]);
  const [genre, setGenre] = useState({ name: '', image_url: '' });

  useEffect(() => {
    fetch(`http://100.98.198.23:8080/api/genre/${encodeURIComponent(genreName)}`)
      .then(res => res.json())
      .then(data => {
        setGenre(data.genre);
        setSongs(data.songs);
      });
  }, [genreName]);

  const handlePlaySong = (song) => {
    setCurrentSong && setCurrentSong(song);
    if (typeof onUpdatePlaylist === 'function') {
      onUpdatePlaylist(songs);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar 
          src={genre.image_url} 
          sx={{ 
            width: 120, 
            height: 120, 
            mr: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }} 
        />
        <Box>
          <Typography 
            variant="h2" 
            sx={{ 
              color: '#fff', 
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            {genre.name}
          </Typography>
        </Box>
      </Box>

      <Typography 
        variant="h5" 
        sx={{ 
          color: '#fff', 
          fontWeight: 700, 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <QueueMusicIcon sx={{ color: '#1db954' }} />
        Bài hát thuộc thể loại này
      </Typography>

      {songs.map((song, idx) => (
        <Box 
          key={song._id} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            py: 1.5, 
            borderBottom: '1px solid rgba(255,255,255,0.1)', 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            '&:hover': { 
              bgcolor: 'rgba(29,185,84,0.1)',
              transform: 'translateX(8px)',
            } 
          }} 
          onClick={() => handlePlaySong(song)}
        >
          <Typography sx={{ width: 40, color: '#b3b3b3' }}>{idx + 1}</Typography>
          <Avatar 
            src={song.cover} 
            sx={{ 
              width: 48, 
              height: 48, 
              mr: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }} 
          />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>{song.title}</Typography>
          </Box>
          <Typography sx={{ color: '#b3b3b3', width: 100, textAlign: 'right' }}>
            {song.views?.toLocaleString()} lượt nghe
          </Typography>
          <Typography sx={{ color: '#b3b3b3', width: 60, textAlign: 'right' }}>
            {formatDuration(song.duration)}
          </Typography>
          <IconButton sx={{ color: '#1db954', ml: 2 }}>
            <PlayArrowIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}

function formatDuration(sec) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
} 