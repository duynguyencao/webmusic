import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';



export default function Header({ search, setSearch, ...props }) {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 2, bgcolor: 'rgba(25,20,20,0.95)', backdropFilter: 'blur(12px)', boxShadow: '0 2px 16px rgba(0,0,0,0.18)', borderBottom: '1.5px solid rgba(255,255,255,0.06)' }}>
      <Toolbar>
        <Typography variant="h5" noWrap sx={{ flexGrow: 1, color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
          Music
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#232526',
            borderRadius: '24px',
            px: 2,
            py: 0.5,
            minWidth: 260,
            maxWidth: 340,
            mr: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
          }}
        >
          <SearchIcon sx={{ color: '#888', mr: 1 }} />
          <InputBase
            placeholder="Tìm kiếm bài hát, nghệ sĩ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{
              color: '#fff',
              fontSize: 16,
              width: '100%',
              '& input::placeholder': {
                color: '#b3b3b3',
                opacity: 1
              }
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {username ? (
            <>
              <Typography sx={{ color: '#fff', fontWeight: 600 }}>{username}</Typography>
              <Button variant="outlined" color="inherit" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 