import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useFavorite } from '../contexts/FavoriteContext';

export default function Player({ song }) {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [volume, setVolume] = React.useState(80);
  const { toggleFavorite, isFavorite } = useFavorite();

  if (!song) return null;

  return (
    <Paper elevation={6} sx={{ position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 1201, bgcolor: '#181818', color: '#fff', borderRadius: 0, px: 2, py: 1, display: 'flex', alignItems: 'center', boxShadow: '0 -2px 10px rgba(0,0,0,0.7)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
        <Box component="img" src={song.cover} alt={song.title} sx={{ width: 48, height: 48, borderRadius: 1, mr: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
        <Box>
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>{song.title}</Typography>
          <Typography variant="subtitle2" sx={{ color: '#b3b3b3' }}>{song.artist}</Typography>
        </Box>
        <IconButton 
          onClick={() => toggleFavorite(song)}
          sx={{ 
            color: isFavorite(song) ? '#1db954' : '#b3b3b3',
            ml: 1,
            '&:hover': { color: '#1db954' }
          }}
        >
          {isFavorite(song) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <IconButton sx={{ color: '#b3b3b3', mx: 1 }}><SkipPreviousIcon fontSize="large" /></IconButton>
          <IconButton onClick={() => setPlaying(!playing)} sx={{ bgcolor: '#fff', color: '#181818', mx: 1, '&:hover': { bgcolor: '#1db954', color: '#fff' }, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
          </IconButton>
          <IconButton sx={{ color: '#b3b3b3', mx: 1 }}><SkipNextIcon fontSize="large" /></IconButton>
        </Box>
        <Slider value={progress} onChange={(_, v) => setProgress(v)} sx={{ color: '#1db954', width: 300, maxWidth: '90%' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120, ml: 2 }}>
        <VolumeUpIcon sx={{ color: '#b3b3b3', mr: 1 }} />
        <Slider value={volume} onChange={(_, v) => setVolume(v)} sx={{ color: '#1db954', width: 80 }} />
      </Box>
    </Paper>
  );
} 