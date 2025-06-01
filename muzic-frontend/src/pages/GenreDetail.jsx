import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function GenreDetail({ setCurrentSong, onUpdatePlaylist }) {
  const { genreName } = useParams();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch(`http://100.98.198.23:8080/api/genre/${encodeURIComponent(genreName)}`)
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        if (typeof onUpdatePlaylist === 'function') {
          onUpdatePlaylist(data);
        }
      });
  }, [genreName]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 120, height: 120, mr: 3 }} />
        <Box>
          <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800 }}>{genreName}</Typography>
        </Box>
      </Box>
      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Bài hát thuộc thể loại này</Typography>
      {songs.map((song, idx) => (
        <Box 
          key={song._id} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            py: 1, 
            borderBottom: '1px solid #222', 
            cursor: 'pointer', 
            '&:hover': { bgcolor: 'rgba(30,215,96,0.05)' } 
          }} 
          onClick={() => {
            setCurrentSong && setCurrentSong(song);
            if (typeof onUpdatePlaylist === 'function') {
              onUpdatePlaylist(songs);
            }
          }}
        >
          <Typography sx={{ width: 32, color: '#b3b3b3' }}>{idx + 1}</Typography>
          <Avatar src={song.cover} sx={{ width: 48, height: 48, mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>{song.title}</Typography>
          </Box>
          <Typography sx={{ color: '#b3b3b3', width: 120, textAlign: 'right' }}>{song.views?.toLocaleString()}</Typography>
          <Typography sx={{ color: '#b3b3b3', width: 60, textAlign: 'right' }}>{formatDuration(song.duration)}</Typography>
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