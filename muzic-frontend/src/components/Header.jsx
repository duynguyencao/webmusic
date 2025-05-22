import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { alpha, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 24,
  backgroundColor: alpha('#232526', 0.7),
  '&:hover': {
    backgroundColor: alpha('#232526', 0.9),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#fff',
  fontWeight: 500,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    borderRadius: 24,
    background: 'rgba(40,40,40,0.7)',
    color: '#fff',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

export default function Header({ role, onLogout, onSelectRole }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ top: 0, zIndex: (theme) => theme.zIndex.drawer + 2, bgcolor: 'rgba(25,20,20,0.95)', backdropFilter: 'blur(12px)', boxShadow: '0 2px 16px rgba(0,0,0,0.18)', borderBottom: '1.5px solid rgba(255,255,255,0.06)' }}>
      <Toolbar>
        <Typography variant="h5" noWrap sx={{ flexGrow: 1, color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
          Music
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{ color: '#b3b3b3' }} />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Tìm kiếm bài hát, nghệ sĩ..." inputProps={{ 'aria-label': 'search' }} />
        </Search>
        <Box sx={{ ml: 2 }}>
          <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
            <Avatar alt="User" sx={{ cursor: 'pointer', transition: '0.2s', bgcolor: '#232526', color: '#fff', width: 40, height: 40, fontWeight: 700 }}>
              {role === 'admin' ? 'A' : role === 'user' ? 'U' : 'ĐN'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            {!role && (
              <>
                <MenuItem onClick={() => { onSelectRole('user'); handleClose(); }}>Đăng nhập User</MenuItem>
                <MenuItem onClick={() => { onSelectRole('admin'); handleClose(); }}>Đăng nhập Admin</MenuItem>
              </>
            )}
            {role && (
              <MenuItem onClick={() => { onLogout(); handleClose(); }}>Đăng xuất</MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 