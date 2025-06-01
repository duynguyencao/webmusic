import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function Player({ song, user, playlist = [], currentIndex = 0, setCurrentSong, reloadFavorites }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setPlaying(!!song);
    if (audioRef.current) audioRef.current.currentTime = 0;
    if (user && user._id) {
      setIsLoading(true);
      fetch(`http://100.98.198.23:8080/api/favorite/${user._id}`)
        .then(res => res.json())
        .then(data => {
          setFavorites(Array.isArray(data) ? data : []);
        })
        .finally(() => setIsLoading(false));
    }
  }, [song, user]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      if (playing) audioRef.current.play();
      else audioRef.current.pause();
    }
  }, [playing, volume, song]);

  const handleTimeUpdate = (e) => setCurrentTime(e.target.currentTime);
  const handleLoadedMetadata = (e) => setDuration(e.target.duration);
  const handleSeek = (_, value) => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const playNext = () => {
    if (!playlist.length) return;
    let nextIdx;
    if (isShuffle) {
      do {
        nextIdx = Math.floor(Math.random() * playlist.length);
      } while (nextIdx === currentIndex && playlist.length > 1);
    } else {
      nextIdx = (currentIndex + 1) % playlist.length;
    }
    setCurrentSong && setCurrentSong(playlist[nextIdx]);
  };

  const playPrev = () => {
    if (!playlist.length) return;
    let prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSong && setCurrentSong(playlist[prevIdx]);
  };

  const handleEnded = () => {
    if (isRepeat) {
      setPlaying(false);
      setTimeout(() => setPlaying(true), 100);
    } else {
      playNext();
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !user._id || !song || !song._id) return;
    const method = favorites.some(fav => fav._id === song._id) ? 'DELETE' : 'POST';
    await fetch('http://100.98.198.23:8080/api/favorite', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, songId: song._id })
    });
    fetch(`http://100.98.198.23:8080/api/favorite/${user._id}`)
      .then(res => res.json())
      .then(data => setFavorites(Array.isArray(data) ? data : []));
    if (typeof reloadFavorites === 'function') reloadFavorites();
  };

  const formatTime = (sec) => {
    if (typeof sec !== 'number' || isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!song) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={song.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
      />
      <Paper
        elevation={6}
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1201,
          bgcolor: '#181818',
          color: '#fff',
          borderRadius: 0,
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.7)',
          height: 100,
          minHeight: 100,
          maxHeight: 120
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
          <Box
            component="img"
            src={song.cover}
            alt={song.title}
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              mr: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          />
          <Box sx={{ maxWidth: 160 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#fff',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: 16
              }}
            >
              {song.title}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#b3b3b3',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: 14
              }}
            >
              {song.artist}
            </Typography>
          </Box>
          <IconButton
            onClick={handleToggleFavorite}
            disabled={isLoading}
            sx={{
              color: favorites.some(fav => fav._id === song._id) ? '#1db954' : '#b3b3b3',
              ml: 1,
              '&:hover': { color: '#1db954' },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' }
            }}
          >
            {favorites.some(fav => fav._id === song._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>

        <Box sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          py: 1,
          bgcolor: 'transparent'
        }}>
          <IconButton onClick={() => setIsShuffle(!isShuffle)} sx={{ color: isShuffle ? '#1db954' : '#b3b3b3' }}><ShuffleIcon /></IconButton>
          <IconButton onClick={playPrev} sx={{ color: '#b3b3b3' }}><SkipPreviousIcon /></IconButton>
          <IconButton onClick={() => setPlaying(!playing)} sx={{
            bgcolor: '#fff',
            color: '#181818',
            mx: 1,
            '&:hover': { bgcolor: '#1db954', color: '#fff' }
          }}>
            {playing ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton onClick={playNext} sx={{ color: '#b3b3b3' }}><SkipNextIcon /></IconButton>
          <IconButton onClick={() => setIsRepeat(!isRepeat)} sx={{ color: isRepeat ? '#1db954' : '#b3b3b3' }}><RepeatIcon /></IconButton>
        </Box>

        <Box sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          pb: 1,
          pt: 0,
          gap: 1
        }}>
          <Typography sx={{ color: '#b3b3b3', fontSize: 14, minWidth: 36, textAlign: 'right' }}>
            {formatTime(currentTime)}
          </Typography>
          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            sx={{
              mx: 1,
              color: '#b3b3b3',
              height: 3,
              flex: 1,
              '& .MuiSlider-thumb': { width: 8, height: 8, bgcolor: '#fff' },
              '& .MuiSlider-rail': { bgcolor: '#444' },
              '& .MuiSlider-track': { bgcolor: '#1db954' }
            }}
          />
          <Typography sx={{ color: '#b3b3b3', fontSize: 14, minWidth: 36, textAlign: 'left' }}>
            {formatTime(duration)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120, ml: 2 }}>
          <VolumeUpIcon sx={{ color: '#b3b3b3', mr: 1 }} />
          <Slider value={volume} onChange={(_, v) => setVolume(v)} sx={{ color: '#1db954', width: 80 }} />
        </Box>
      </Paper>
    </>
  );
} 
