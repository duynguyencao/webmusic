import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import SongCard from '../components/SongCard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Sidebar from '../components/Sidebar';

const initialSongs = [
  {
    title: 'Song 1',
    artist: 'Artist 1',
    cover: 'https://picsum.photos/200?random=1',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'Song 2',
    artist: 'Artist 2',
    cover: 'https://picsum.photos/200?random=2',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'Song 3',
    artist: 'Artist 3',
    cover: 'https://picsum.photos/200?random=3',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    title: 'Song 4',
    artist: 'Artist 4',
    cover: 'https://picsum.photos/200?random=4',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    title: 'Song 5',
    artist: 'Artist 5',
    cover: 'https://picsum.photos/200?random=5',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
];

const albums = [
  { name: 'Album 1', artist: 'Artist A', cover: 'https://picsum.photos/120?random=21' },
  { name: 'Album 2', artist: 'Artist B', cover: 'https://picsum.photos/120?random=22' },
  { name: 'Album 3', artist: 'Artist C', cover: 'https://picsum.photos/120?random=23' },
];

export default function Home({ role }) {
  const [songs, setSongs] = useState(initialSongs);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', artist: '', cover: '', src: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', artist: '', cover: '', src: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setForm({ title: '', artist: '', cover: '', src: '' }); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = () => {
    if (form.title && form.artist && form.cover && form.src) {
      setSongs([{ ...form }, ...songs]);
      handleClose();
    }
  };

  const handleEditOpen = (idx) => {
    setEditIndex(idx);
    setEditForm(songs[idx]);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditForm({ title: '', artist: '', cover: '', src: '' });
    setEditIndex(null);
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSave = () => {
    const updated = [...songs];
    updated[editIndex] = editForm;
    setSongs(updated);
    setEditOpen(false);
  };

  const handleDelete = (idx) => {
    if (window.confirm('Bạn có chắc muốn xóa bài hát này?')) {
      setSongs(songs.filter((_, i) => i !== idx));
    }
  };

  // Lọc bài hát theo từ khóa tìm kiếm
  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase())
  );

  if (role === 'admin') {
    return (
      <Box sx={{
        minHeight: '100vh',
        p: 6,
        background: `linear-gradient(120deg, #232526 0%, #191414 60%, #1db954 100%)`,
        fontFamily: 'Roboto, Arial',
      }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>Quản lý bài hát</Box>
          <Button
            variant="contained"
            sx={{ bgcolor: '#1db954', color: '#fff', fontWeight: 700, borderRadius: 3, boxShadow: '0 2px 8px rgba(30,215,96,0.18)', '&:hover': { bgcolor: '#1ed760' } }}
            onClick={handleOpen}
          >
            + Thêm bài hát
          </Button>
        </Box>
        <TextField
          label="Tìm kiếm bài hát hoặc nghệ sĩ"
          variant="outlined"
          fullWidth
          sx={{ mb: 4, bgcolor: '#232526', borderRadius: 2, input: { color: '#fff' }, label: { color: '#b3b3b3' } }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Grid container spacing={5}>
          {filteredSongs.map((song, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={idx}>
              <SongCard
                song={song}
                role={role}
                onEdit={() => handleEditOpen(songs.indexOf(song))}
                onDelete={() => handleDelete(songs.indexOf(song))}
              />
            </Grid>
          ))}
        </Grid>
        {/* Dialog thêm bài hát */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Thêm bài hát mới</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
            <TextField label="Tên bài hát" name="title" value={form.title} onChange={handleChange} fullWidth autoFocus />
            <TextField label="Nghệ sĩ" name="artist" value={form.artist} onChange={handleChange} fullWidth />
            <TextField label="Link ảnh bìa" name="cover" value={form.cover} onChange={handleChange} fullWidth />
            <TextField label="Link nhạc (mp3)" name="src" value={form.src} onChange={handleChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleAdd} variant="contained" sx={{ bgcolor: '#1db954', color: '#fff', '&:hover': { bgcolor: '#1ed760' } }}>Thêm</Button>
          </DialogActions>
        </Dialog>
        {/* Dialog chỉnh sửa bài hát */}
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Chỉnh sửa bài hát</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
            <TextField label="Tên bài hát" name="title" value={editForm.title} onChange={handleEditChange} fullWidth />
            <TextField label="Nghệ sĩ" name="artist" value={editForm.artist} onChange={handleEditChange} fullWidth />
            <TextField label="Link ảnh bìa" name="cover" value={editForm.cover} onChange={handleEditChange} fullWidth />
            <TextField label="Link nhạc (mp3)" name="src" value={editForm.src} onChange={handleEditChange} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Hủy</Button>
            <Button onClick={handleEditSave} variant="contained" sx={{ bgcolor: '#1db954', color: '#fff', '&:hover': { bgcolor: '#1ed760' } }}>Lưu</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Nếu không phải admin, render giao diện người dùng bình thường
  return (
    <Box sx={{
      minHeight: '100vh',
      p: 6,
      position: 'relative',
      background: `linear-gradient(120deg, #232526 0%, #191414 60%, #1db954 100%)`,
      overflow: 'hidden',
      fontFamily: 'Roboto, Arial',
    }}>
      {/* Overlay blur */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'linear-gradient(120deg, rgba(30,215,96,0.08) 0%, rgba(25,20,20,0.7) 100%)',
        backdropFilter: 'blur(32px)',
        pointerEvents: 'none',
      }} />
      <Box sx={{ mb: 6, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Box sx={{ fontSize: 38, fontWeight: 800, color: '#fff', mb: 1, letterSpacing: 1 }}>Khám phá nhạc mới</Box>
          <Box sx={{ color: '#b3b3b3', fontSize: 20 }}>Những bài hát nổi bật dành cho bạn</Box>
        </Box>
        {role === 'admin' && (
          <Button variant="contained" sx={{ bgcolor: '#1db954', color: '#fff', fontWeight: 700, borderRadius: 3, boxShadow: '0 2px 8px rgba(30,215,96,0.18)', '&:hover': { bgcolor: '#1ed760' } }} onClick={handleOpen}>
            + Thêm bài hát
          </Button>
        )}
      </Box>
      <Grid container spacing={5} sx={{ position: 'relative', zIndex: 1 }}>
        {songs.map((song, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={idx}>
            <SongCard
              song={song}
              role={role}
              onEdit={() => handleEditOpen(idx)}
              onDelete={() => handleDelete(idx)}
            />
          </Grid>
        ))}
      </Grid>
      {/* Section playlist nổi bật */}
      <Box sx={{ mt: 8, position: 'relative', zIndex: 1 }}>
        <Box sx={{ fontSize: 28, fontWeight: 700, color: '#fff', mb: 2 }}>Playlist nổi bật</Box>
        <Grid container spacing={4}>
          {[1,2,3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.04)',
                borderRadius: 4,
                p: 3,
                boxShadow: '0 2px 16px rgba(30,215,96,0.10)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 32px rgba(30,215,96,0.18)' },
              }}>
                <Box component="img" src={`https://picsum.photos/80?random=${i+10}`} alt="playlist" sx={{ borderRadius: 2, width: 80, height: 80, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }} />
                <Box>
                  <Box sx={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>Playlist {i}</Box>
                  <Box sx={{ color: '#b3b3b3', fontSize: 16 }}>Mô tả playlist nổi bật {i}</Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ mt: 8, position: 'relative', zIndex: 1 }}>
        <Box sx={{ fontSize: 28, fontWeight: 700, color: '#fff', mb: 2 }}>Album/Artist nổi bật</Box>
        <Grid container spacing={4}>
          {albums.map((album, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.04)',
                borderRadius: 4,
                p: 3,
                boxShadow: '0 2px 16px rgba(30,215,96,0.10)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 32px rgba(30,215,96,0.18)' },
              }}>
                <Box component="img" src={album.cover} alt={album.name} sx={{ borderRadius: 2, width: 80, height: 80, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }} />
                <Box>
                  <Box sx={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>{album.name}</Box>
                  <Box sx={{ color: '#b3b3b3', fontSize: 16 }}>{album.artist}</Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ mt: 10, textAlign: 'center', color: '#b3b3b3', fontSize: 16, opacity: 0.7, position: 'relative', zIndex: 2 }}>
        © 2025 Muzic. All rights reserved.
      </Box>
      {role !== 'admin' && <Sidebar role={role} />}
    </Box>
  );
} 