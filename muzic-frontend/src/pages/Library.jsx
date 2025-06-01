import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Sidebar from '../components/Sidebar';

export default function Library({ user, setCurrentSong, reloadFavorites, favoritesReloadKey, onUpdatePlaylist }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (user && user._id) {
            fetch(`http://100.98.198.23:8080/api/favorite/${user._id}`)
                .then(res => res.json())
                .then(data => {
                    const favoritesList = Array.isArray(data) ? data : [];
                    setFavorites(favoritesList);
                    if (typeof onUpdatePlaylist === 'function') {
                        onUpdatePlaylist(favoritesList);
                    }
                });
        }
    }, [user, favoritesReloadKey]);

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
                background: 'linear-gradient(120deg, rgba(30,215,96,0.08) 0%, rgba(25,20,20,0.7) 100%)',
                backdropFilter: 'blur(32px)',
                pointerEvents: 'none',
            }} />
            
            <Box sx={{ mb: 6, position: 'relative', zIndex: 1 }}>
                <Box sx={{ fontSize: 38, fontWeight: 800, color: '#fff', mb: 1, letterSpacing: 1 }}>
                    Thư viện của bạn
                </Box>
                <Box sx={{ color: '#b3b3b3', fontSize: 20 }}>
                    Danh sách bài hát yêu thích
                </Box>
            </Box>

            <TableContainer 
                component={Paper} 
                sx={{ 
                    position: 'relative',
                    zIndex: 1,
                    bgcolor: 'rgba(24,24,24,0.98)',
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    overflow: 'hidden'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>#</TableCell>
                            <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Tiêu đề</TableCell>
                            <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Nghệ sĩ</TableCell>
                            <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}>Thời lượng</TableCell>
                            <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 2 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {favorites.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ color: '#fff', textAlign: 'center', py: 3 }}>
                                    Chưa có bài hát yêu thích
                                </TableCell>
                            </TableRow>
                        ) : favorites.map((song, idx) => (
                            <TableRow key={song._id}>
                                <TableCell sx={{ color: '#fff', py: 2 }}>{idx + 1}</TableCell>
                                <TableCell sx={{ color: '#fff', py: 2 }}>{song.title}</TableCell>
                                <TableCell sx={{ color: '#b3b3b3', py: 2 }}>{song.artist}</TableCell>
                                <TableCell sx={{ color: '#b3b3b3', py: 2 }}>{formatDuration(song.duration)}</TableCell>
                                <TableCell>
                                    <IconButton 
                                        className="play-button"
                                        sx={{ color: '#1db954' }}
                                        onClick={() => {
                                            setCurrentSong && setCurrentSong(song);
                                            if (typeof onUpdatePlaylist === 'function') {
                                                onUpdatePlaylist(favorites);
                                            }
                                        }}
                                    >
                                        <PlayArrowIcon />
                                    </IconButton>
                                    <IconButton
                                        sx={{ color: '#b3b3b3', ml: 1 }}
                                        onClick={() => handleRemoveFavorite(song._id)}
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