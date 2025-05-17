import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 220;

const menu = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Search', icon: <SearchIcon />, path: '/search' },
  { text: 'Library', icon: <LibraryMusicIcon />, path: '/library' },
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
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            width: 0,
            background: 'transparent',
          },
          '&:hover::-webkit-scrollbar': {
            width: '8px',
            background: 'transparent',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 8,
          },
          '&:hover': {
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,0,0,0.2) transparent',
          },
        },
      }}
    >
      <Toolbar sx={{ minHeight: 32, bgcolor: 'transparent' }} />
      <Divider sx={{ bgcolor: '#282828' }} />
      <List sx={{ mt: 4 }}>
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
              my: 1.5,
              py: 1.5,
              backgroundColor: 'transparent',
              '& .MuiListItemIcon-root': {
                color: location.pathname === item.path ? '#1db954' : '#fff',
                minWidth: 40,
              },
              '& .MuiListItemText-primary': {
                color: location.pathname === item.path ? '#1db954' : '#fff',
              },
              '&.Mui-selected, &:hover': {
                bgcolor: '#282828',
                '& .MuiListItemIcon-root': {
                  color: '#1db954',
                },
                '& .MuiListItemText-primary': {
                  color: '#1db954',
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600, fontSize: 18 }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
