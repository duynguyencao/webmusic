import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Library({ setCurrentSong }) {
  const username = localStorage.getItem('username');
  const [favorites, setFavorites] = useState([]);

  const getSongKey = (song) => song?._id || song?.src || (song?.title + song?.artist);

  useEffect(() => {
    if (!username) {
      setFavorites([]);
      return;
    }
    const favStr = localStorage.getItem(`favorites_${username}`);
    setFavorites(favStr ? JSON.parse(favStr) : []);
    const updateFavorites = () => {
      const favStr = localStorage.getItem(`favorites_${username}`);
      setFavorites(favStr ? JSON.parse(favStr) : []);
    };
    window.addEventListener('favorites-updated', updateFavorites);
    return () => window.removeEventListener('favorites-updated', updateFavorites);
  }, [username]);

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
                <TableRow
                  key={getSongKey(song)}
                  hover
                  sx={{ '&:hover': { bgcolor: 'rgba(29,185,84,0.08)', cursor: 'pointer' } }}
                  onClick={() => setCurrentSong && setCurrentSong(song)}
                >
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