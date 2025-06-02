import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Typography,
  Fade,
  Chip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Sidebar from '../components/Sidebar';

const Ranking = ({ setCurrentSong, onUpdatePlaylist, user }) => {
  const [songs, setSongs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('http://100.98.198.23:8080/api/song')
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        setIsLoaded(true);
      });
  }, []);

  const handlePlaySong = (song) => {
    setCurrentSong && setCurrentSong(song);
    if(typeof onUpdatePlaylist === 'function'){
      onUpdatePlaylist(songs);
    }
  };

  const getRankColor = (index) => {
    switch(index) {
      case 0: return '#FFD700'; 
      case 1: return '#C0C0C0'; 
      case 2: return '#CD7F32'; 
      default: return '#fff';
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      p: 6,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Roboto, Arial',
    }}>
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(135deg, rgba(30,215,96,0.12) 0%, rgba(25,20,20,0.85) 100%)',
        backdropFilter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <Fade in={isLoaded} timeout={800}>
        <Box>
          <Box sx={{ mb: 6, position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 32, md: 42 },
                fontWeight: 800,
                color: '#fff',
                mb: 2,
                letterSpacing: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              Bảng xếp hạng
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: '#b3b3b3',
                fontSize: { xs: 16, md: 20 },
                fontWeight: 500,
                opacity: 0.9,
              }}
            >
              Những bài hát được nghe nhiều nhất
            </Typography>
          </Box>

          <TableContainer 
            component={Paper} 
            sx={{ 
              position: 'relative',
              zIndex: 1,
              bgcolor: 'rgba(24,24,24,0.98)',
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>#</TableCell>
                  <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Bìa</TableCell>
                  <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Tên bài hát</TableCell>
                  <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Nghệ sĩ</TableCell>
                  <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Lượt nghe</TableCell>
                  <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Phát</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...songs]
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .map((song, idx) => (
                    <TableRow 
                      key={song._id}
                      sx={{
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.05)',
                        }
                      }}
                    >
                      <TableCell sx={{ color: getRankColor(idx), py: 2, fontWeight: idx < 3 ? 700 : 400 }}>
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <Avatar 
                          src={song.cover} 
                          alt={song.title} 
                          variant="rounded"
                          sx={{
                            width: 48,
                            height: 48,
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#fff', py: 2 }}>{song.title}</TableCell>
                      <TableCell sx={{ color: '#b3b3b3', py: 2 }}>{song.artist}</TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          icon={<TrendingUpIcon />}
                          label={song.views?.toLocaleString() || 0}
                          sx={{
                            bgcolor: 'rgba(29,185,84,0.1)',
                            color: '#1db954',
                            '& .MuiChip-icon': {
                              color: '#1db954',
                            },
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: 'rgba(29,185,84,0.2)',
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handlePlaySong(song)}
                          sx={{ 
                            color: '#1db954',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              color: '#1ed760',
                            }
                          }}
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 10, textAlign: 'center', color: '#b3b3b3', fontSize: 16, opacity: 0.7, position: 'relative', zIndex: 2 }}>
            © 2025 Muzic. All rights reserved.
          </Box>
        </Box>
      </Fade>
      <Sidebar />
    </Box>
  );
};

export default Ranking;