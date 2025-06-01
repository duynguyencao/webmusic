import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://100.98.198.23:8080/api/artist')
      .then(res => res.json())
      .then(data => {
        console.log('Artists API data:', data);
        setArtists(data);
      });
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Nghệ sĩ phổ biến</Typography>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {artists.map((artist, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'
            }}
            onClick={() => navigate(`/artist/${encodeURIComponent(artist.name || artist)}`)}
          >
            <Avatar
              src={artist.image_url || ''}
              sx={{ width: 100, height: 100, mb: 1, border: '3px solid #1db954' }}
            />
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>{artist.name || artist}</Typography>
            <Typography sx={{ color: '#b3b3b3', fontSize: 14 }}>Nghệ sĩ</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
} 