import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import HistoryIcon from '@mui/icons-material/History';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

const drawerWidth = 220;

const menu = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Library', icon: <LibraryMusicIcon />, path: '/library' },
  { text: 'History', icon: <HistoryIcon />, path: '/history' },
  { text: 'Bảng xếp hạng', icon: <LeaderboardIcon />, path: '/ranking' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          minWidth: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#181818',
          color: '#fff',
          borderRight: 0,
          boxShadow: '4px 0 24px 0 rgba(0,0,0,0.25)',
          overflowY: 'hidden',
        },
      }}
    >
      <Toolbar />
      <List sx={{ mt: 2, overflow: 'hidden' }}>
        {menu.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              color: location.pathname === item.path ? '#1db954' : '#fff',
              bgcolor: location.pathname === item.path ? 'rgba(30,185,84,0.08)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(30,185,84,0.12)',
                color: '#1db954',
              },
              transition: 'all 0.2s',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ fontWeight: 600 }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
