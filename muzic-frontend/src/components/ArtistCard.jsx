import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

export default function ArtistCard({ artist }) {
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
        bgcolor: 'transparent',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-8px)',
          bgcolor: 'rgba(29,185,84,0.15)',
          boxShadow: '0 8px 24px rgba(29,185,84,0.15)',
        }
      }}
      onClick={() => navigate(`/artist/${encodeURIComponent(artist.name)}`)}
    >
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={artist.image_url}
          sx={{ 
            width: { xs: 100, md: 120 },
            height: { xs: 100, md: 120 },
            mb: 2,
            border: '2px solid rgba(29,185,84,0.5)',
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
            bottom: 12,
            right: -6,
            bgcolor: 'rgba(29,185,84,0.8)',
            borderRadius: '50%',
            p: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(29,185,84,0.2)',
          }}
        >
          <MusicNoteIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
      </Box>
      <Typography 
        sx={{ 
          color: '#fff', 
          fontWeight: 600,
          fontSize: { xs: 15, md: 16 },
          mb: 0.5,
          textAlign: 'center',
        }}
      >
        {artist.name}
      </Typography>
      <Typography 
        sx={{ 
          color: '#b3b3b3', 
          fontSize: 13,
          opacity: 0.8,
        }}
      >
        Nghệ sĩ
      </Typography>
    </Paper>
  );
} 