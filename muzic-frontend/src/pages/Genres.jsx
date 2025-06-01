import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Hardcode ảnh cho từng thể loại nếu muốn
const genreAvatars = {
  "Pop": "",
  "Ballad": "",
  "HipHop": "",
  // ... thêm link ảnh nếu muốn
};

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://100.98.198.23:8080/api/genre')
      .then(res => res.json())
      .then(setGenres);
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Thể loại nổi bật</Typography>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {genres.map((genre, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'
            }}
            onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
          >
            <Avatar
              src={genreAvatars[genre] || ''}
              sx={{ width: 100, height: 100, mb: 1, border: '3px solid #1db954' }}
            />
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>{genre}</Typography>
            <Typography sx={{ color: '#b3b3b3', fontSize: 14 }}>Thể loại</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
} 