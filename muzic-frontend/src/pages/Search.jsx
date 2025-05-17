import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Search() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'rgba(25,20,20,0.98)', color: '#fff', p: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Tìm kiếm nhạc (sắp có)
      </Typography>
      <Typography variant="body1" sx={{ color: '#b3b3b3' }}>
        Tính năng tìm kiếm sẽ sớm được cập nhật để bạn khám phá kho nhạc khổng lồ!
      </Typography>
    </Box>
  );
} 