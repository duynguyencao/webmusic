import React, { useState, useEffect } from 'react';
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
import { fetchModel } from '../lib/fetchModelData';
import { supabase } from '../lib/supabase';
import removeVietnameseTones from '../lib/removeVietnameseTones';

export default function Home({ role, setCurrentSong }) {
  const [songs, setSongs] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', artist: '', cover: '', src: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', artist: '', cover: '', src: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [file, setFile] = useState(null);

  // Fetch danh sách bài hát từ backend
  useEffect(() => {
    fetchModel('songs')
      .then(data => setSongs(data))
      .catch(err => console.error('Lỗi fetch songs:', err));
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setForm({ title: '', artist: '', cover: '', src: '' }); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Thêm bài hát (POST)
  const handleAdd = async () => {
    if (form.title && form.artist && file) {
      if (!form.cover) {
        alert('Vui lòng nhập link ảnh bìa (cover)!');
        return;
      }
      try {
        // Tạo tên file mp3 từ tên bài hát (không dấu, viết thường, thay khoảng trắng bằng _)
        const baseName = removeVietnameseTones(form.title).toLowerCase().replace(/\s+/g, '_');
        const fileName = `${baseName}.mp3`;
        // Sửa lại cú pháp upload đúng chuẩn SDK
        const { data, error } = await supabase
          .storage
          .from('song')
          .upload(`track/${fileName}`, file, { upsert: true });
        console.log('Kết quả upload Supabase:', { data, error });
        if (error) throw error;
        const publicUrl = `https://mqamtavoeneqrvfmgkhs.supabase.co/storage/v1/object/public/song/track/${fileName}`;
        console.log('Link public Supabase:', publicUrl);
        const res = await fetch('http://localhost:5000/api/song', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            src: publicUrl,
          }),
        });
        console.log('Kết quả response backend:', res);
        if (!res.ok) throw new Error('Lỗi thêm bài hát');
        const newSong = await res.json();
        setSongs([newSong, ...songs]);
        handleClose();
      } catch (err) {
        alert('Lỗi: ' + (err.message || err));
        console.error(err);
      }
    } else {
      alert('Vui lòng nhập đầy đủ tên bài hát, nghệ sĩ và chọn file mp3!');
    }
  };

  // Sửa bài hát (PUT)
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
  const handleEditSave = async () => {
    try {
      const songId = songs[editIndex]._id;
      const res = await fetch(`http://localhost:5000/api/song/${songId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error('Lỗi cập nhật bài hát');
      const updatedSong = await res.json();
      const updated = [...songs];
      updated[editIndex] = updatedSong;
      setSongs(updated);
      setEditOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Xóa bài hát (DELETE)
  const handleDelete = async (idx) => {
    if (window.confirm('Bạn có chắc muốn xóa bài hát này?')) {
      try {
        const songId = songs[idx]._id;
        const res = await fetch(`http://localhost:5000/api/song/${songId}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Lỗi xóa bài hát');
        setSongs(songs.filter((_, i) => i !== idx));
      } catch (err) {
        console.error(err);
      }
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
            <input type="file" accept="audio/mp3" onChange={handleFileChange} />
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
              onPlay={() => setCurrentSong(song)}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 10, textAlign: 'center', color: '#b3b3b3', fontSize: 16, opacity: 0.7, position: 'relative', zIndex: 2 }}>
        © 2025 Muzic. All rights reserved.
      </Box>
      {role !== 'admin' && <Sidebar role={role} />}
    </Box>
  );
} 