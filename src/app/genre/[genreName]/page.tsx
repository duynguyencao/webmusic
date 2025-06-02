'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, IconButton, Paper, Grid, Button, Skeleton } from '@mui/material';
import { useParams } from 'next/navigation';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';

interface Song {
  _id: string;
  title: string;
  cover: string;
  views: number;
  duration: number;
  is_favorite?: boolean;
}

interface Genre {
  name: string;
  image_url: string;
  description?: string;
}

export default function GenreDetail() {
  const { genreName } = useParams();
  const [songs, setSongs] = useState<Song[]>([]);
  const [genre, setGenre] = useState<Genre>({ name: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, updatePlaylist } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const res = await fetch(`/api/genre/${encodeURIComponent(genreName as string)}`);
        const data = await res.json();
        setGenre(data.genre);
        setSongs(data.songs);
        updatePlaylist(data.songs);
      } catch (error) {
        console.error('Error fetching genre data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreData();
  }, [genreName]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setCurrentSong(songs[0]);
      updatePlaylist(songs);
    }
  };

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    updatePlaylist(songs);
  };

  const handleToggleFavorite = async (songId: string) => {
    if (!user) return;
    
    try {
      const res = await fetch(`/api/favorites/${songId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });
      
      if (res.ok) {
        setSongs(songs.map(song => 
          song._id === songId 
            ? { ...song, is_favorite: !song.is_favorite }
            : song
        ));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Grid item>
            <Skeleton variant="circular" width={160} height={160} />
          </Grid>
          <Grid item xs>
            <Skeleton variant="text" width="60%" height={60} />
            <Skeleton variant="text" width="40%" height={30} />
          </Grid>
        </Grid>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" height={72} sx={{ mb: 1, borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Genre Header */}
      <Paper 
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(45deg, rgba(29,185,84,0.1) 0%, rgba(29,185,84,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(29,185,84,0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(29,185,84,0.1), transparent 70%)',
            zIndex: 0,
          }
        }}
      >
        <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item>
            <Avatar 
              src={genre.image_url} 
              sx={{ 
                width: { xs: 120, md: 160 }, 
                height: { xs: 120, md: 160 },
                border: '3px solid rgba(29,185,84,0.3)',
                boxShadow: '0 8px 32px rgba(29,185,84,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: '#1db954',
                }
              }} 
            />
          </Grid>
          <Grid item xs>
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#fff', 
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {genre.name}
            </Typography>
            {genre.description && (
              <Typography 
                sx={{ 
                  color: '#b3b3b3',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  maxWidth: '600px',
                  lineHeight: 1.6,
                }}
              >
                {genre.description}
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={handlePlayAll}
                sx={{
                  bgcolor: '#1db954',
                  '&:hover': { 
                    bgcolor: '#1ed760',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(29,185,84,0.3)',
                  },
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  transition: 'all 0.3s ease',
                }}
              >
                Phát tất cả
              </Button>
              <Button
                variant="outlined"
                startIcon={<QueueMusicIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  '&:hover': { 
                    borderColor: '#1db954',
                    bgcolor: 'rgba(29,185,84,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  transition: 'all 0.3s ease',
                }}
              >
                Thêm vào hàng đợi
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Songs List */}
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#fff', 
          fontWeight: 700, 
          mb: 3,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <QueueMusicIcon sx={{ color: '#1db954' }} />
        Bài hát thuộc thể loại này
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1,
      }}>
        {songs.map((song, idx) => (
          <Paper
            key={song._id}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.03)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(29,185,84,0.1)',
                transform: 'translateX(8px)',
                '& .play-button': {
                  opacity: 1,
                  transform: 'scale(1)',
                }
              },
            }}
          >
            <Typography 
              sx={{ 
                width: 40, 
                color: '#b3b3b3',
                fontSize: '0.9rem',
              }}
            >
              {idx + 1}
            </Typography>
            <Avatar 
              src={song.cover} 
              sx={{ 
                width: 48, 
                height: 48, 
                mr: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }} 
            />
            <Box sx={{ flex: 1 }}>
              <Typography 
                sx={{ 
                  color: '#fff', 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                {song.title}
              </Typography>
            </Box>
            <Typography 
              sx={{ 
                color: '#b3b3b3', 
                width: 100, 
                textAlign: 'right',
                fontSize: '0.9rem',
              }}
            >
              {song.views?.toLocaleString()} lượt nghe
            </Typography>
            <Typography 
              sx={{ 
                color: '#b3b3b3', 
                width: 60, 
                textAlign: 'right',
                fontSize: '0.9rem',
              }}
            >
              {formatDuration(song.duration)}
            </Typography>
            <IconButton 
              onClick={() => handleToggleFavorite(song._id)}
              sx={{ 
                color: song.is_favorite ? '#1db954' : '#b3b3b3',
                '&:hover': { 
                  color: '#1db954',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {song.is_favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton 
              onClick={() => handlePlaySong(song)}
              className="play-button"
              sx={{ 
                color: '#1db954',
                opacity: 0,
                transform: 'scale(0.8)',
                '&:hover': { 
                  color: '#1ed760',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

function formatDuration(sec: number) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
} 