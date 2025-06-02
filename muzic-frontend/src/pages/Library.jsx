import React, { useEffect, useState } from 'react';
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
    Typography,
    Fade,
    Avatar,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function Library({ user, setCurrentSong, reloadFavorites, favoritesReloadKey, onUpdatePlaylist }) {
    const [favorites, setFavorites] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!user){
            navigate('/login')
            return;
        }
        if (user && user._id) {
            fetch(`http://100.98.198.23:8080/api/favorite/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    const favoritesList = Array.isArray(data) ? data : [];
                    setFavorites(favoritesList);
                    if (typeof onUpdatePlaylist === 'function' && favoritesReloadKey) {
                        onUpdatePlaylist(favoritesList);
                    }
                    setIsLoaded(true);
                });
        }
    }, [user, favoritesReloadKey]);
    
    const handlePlaySong = (song) => {
        if(user && user._id){
            fetch('http://100.98.198.23:8080/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, songId: song._id })
            });
        }
        setCurrentSong(song);
        onUpdatePlaylist && onUpdatePlaylist(favorites);
    }

    const handleRemoveFavorite = async (songId) => {
        if (!user || !user._id || !songId) return;
        await fetch('http://100.98.198.23:8080/api/favorite', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, songId })
        });
        if (typeof reloadFavorites === 'function') reloadFavorites();
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
                            Thư viện của bạn
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
                            Danh sách bài hát yêu thích
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
                                    <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Tiêu đề</TableCell>
                                    <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Nghệ sĩ</TableCell>
                                    <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Thời lượng</TableCell>
                                    <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {favorites.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ color: '#fff', textAlign: 'center', py: 4 }}>
                                            Chưa có bài hát yêu thích
                                        </TableCell>
                                    </TableRow>
                                ) : favorites.map((song, idx) => (
                                    <TableRow 
                                        key={song._id}
                                        sx={{
                                            transition: 'background-color 0.2s ease',
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.05)',
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ color: '#fff', py: 2 }}>{idx + 1}</TableCell>
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
                                        <TableCell sx={{ color: '#b3b3b3', py: 2 }}>{formatDuration(song.duration)}</TableCell>
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
                                            <IconButton
                                                onClick={() => handleRemoveFavorite(song._id)}
                                                sx={{ 
                                                    color: '#b3b3b3',
                                                    ml: 1,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',
                                                        color: '#e53935',
                                                    }
                                                }}
                                                title="Xóa khỏi yêu thích"
                                            >
                                                <FavoriteBorderIcon />
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
}

function formatDuration(sec) {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
} 