import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Library() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Lấy userId và token từ localStorage (giả sử đã đăng nhập)
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) return;
    fetch(`http://localhost:5000/api/user/${userId}/favorites`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setFavorites(data))
      .catch(err => setFavorites([]));
  }, []);

  function formatNumber(num) {
    if (!num) return '';
    return num.toLocaleString('de-DE');
  }

  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'rgba(25,20,20,0.98)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FavoriteIcon sx={{ color: '#1db954', fontSize: 40, mr: 2 }} />
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Thư viện yêu thích
        </Typography>
      </Box>
      {favorites.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, p: 4 }}>
          <FavoriteIcon sx={{ color: '#b3b3b3', fontSize: 60, mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#b3b3b3', textAlign: 'center', mb: 1 }}>
            Chưa có bài hát yêu thích nào
          </Typography>
          <Typography variant="body2" sx={{ color: '#b3b3b3', textAlign: 'center', maxWidth: '400px' }}>
            Thêm bài hát yêu thích của bạn bằng cách nhấn vào biểu tượng trái tim khi đang nghe nhạc
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: 'rgba(24,24,24,0.98)', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#b3b3b3', border: 0 }}>#</TableCell>
                <TableCell sx={{ color: '#b3b3b3', border: 0 }}>Bài hát</TableCell>
                <TableCell sx={{ color: '#b3b3b3', border: 0 }}>Lượt nghe</TableCell>
                <TableCell sx={{ color: '#b3b3b3', border: 0 }}>Thời lượng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {favorites.map((song, idx) => (
                <TableRow key={idx} hover sx={{ '&:hover': { bgcolor: 'rgba(29,185,84,0.08)' } }}>
                  <TableCell sx={{ color: '#fff', border: 0, fontWeight: 500 }}>{idx + 1}</TableCell>
                  <TableCell sx={{ color: '#fff', border: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={song.cover} alt={song.title} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />
                    <Box>
                      <Typography sx={{ color: '#fff', fontWeight: 600 }}>{song.title}</Typography>
                      <Typography sx={{ color: '#b3b3b3', fontSize: 14 }}>{song.artist}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#fff', border: 0 }}>{formatNumber(song.views || 0)}</TableCell>
                  <TableCell sx={{ color: '#fff', border: 0 }}>{song.duration || '--:--'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
} 