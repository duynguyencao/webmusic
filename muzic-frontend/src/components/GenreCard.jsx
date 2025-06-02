import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

export default function GenreCard({ genre }) {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        p: 2,
        borderRadius: 2,
        bgcolor: 'rgba(24,24,24,0.98)',
        transition: 'all 0.3s ease',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-8px)',
          bgcolor: 'rgba(29,185,84,0.1)',
          boxShadow: '0 8px 24px rgba(29,185,84,0.2)',
        }
      }}
      onClick={() => navigate(`/genre/${encodeURIComponent(genre.name)}`)}
    >
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={genre.image_url}
          sx={{ 
            width: { xs: 120, md: 140 },
            height: { xs: 120, md: 140 },
            mb: 2,
            border: '3px solid #1db954',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              borderColor: '#1ed760',
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: -8,
            bgcolor: '#1db954',
            borderRadius: '50%',
            p: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(29,185,84,0.3)',
          }}
        >
          <QueueMusicIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
      </Box>
      <Typography 
        sx={{ 
          color: '#fff', 
          fontWeight: 600,
          fontSize: { xs: 16, md: 18 },
          mb: 0.5,
          textAlign: 'center',
        }}
      >
        {genre.name}
      </Typography>
      <Typography 
        sx={{ 
          color: '#b3b3b3', 
          fontSize: 14,
          opacity: 0.8,
        }}
      >
        Thể loại
      </Typography>
    </Paper>
  );
} 