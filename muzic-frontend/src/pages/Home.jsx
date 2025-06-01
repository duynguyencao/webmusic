import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import SongCard from "../components/SongCard";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Sidebar from "../components/Sidebar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Artists from "./Artists";
import Genres from "./Genres";

export default function Home({
  user,
  setCurrentSong,
  search,
  onUpdatePlaylist,
  ...props
}) {
  console.log("user in Home:", user);
  const isAdmin = user && user.username === "admin";

  const [songs, setSongs] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", artist: "", genre: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    artist: "",
    genre: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await fetch("http://100.98.198.23:8080/api/song");
      const data = await res.json();
      setSongs(data);
      if (typeof onUpdatePlaylist === "function") {
        onUpdatePlaylist(data);
      }
    } catch (err) {
      console.error("Lỗi fetch songs:", err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ title: "", artist: "", genre: "" });
    setFile(null);
    setCoverFile(null);
  };
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleCoverChange = (e) => setCoverFile(e.target.files[0]);

  const handleAdd = async () => {
    if (form.title && form.artist && file && coverFile) {
      try {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("artist", form.artist);
        if (form.genre) formData.append("genre", form.genre);
        formData.append("track", file);
        formData.append("cover", coverFile);

        const res = await fetch("http://100.98.198.23:8080/api/song", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Lỗi thêm bài hát");
        const result = await res.json();
        if (result.success && result.song) {
          setSongs([result.song, ...songs]);
        } else {
          fetchSongs();
        }
        handleClose();
      } catch (err) {
        alert("Lỗi: " + (err.message || err));
        console.error(err);
      }
    } else {
      alert(
        "Vui lòng nhập đầy đủ tên bài hát, nghệ sĩ, chọn file mp3 và ảnh bìa!"
      );
    }
  };

  const handleEditOpen = (idx) => {
    setEditIndex(idx);
    setEditForm({
      title: songs[idx].title,
      artist: songs[idx].artist,
      genre: songs[idx].genre || "",
    });
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditForm({ title: "", artist: "", genre: "" });
    setEditIndex(null);
  };
  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSave = async () => {
    try {
      const songId = songs[editIndex]._id;
      const res = await fetch(`http://100.98.198.23:8080/api/song/${songId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Lỗi cập nhật bài hát");
      const updatedSong = await res.json();
      const updated = [...songs];
      updated[editIndex] = updatedSong;
      setSongs(updated);
      setEditOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (idx) => {
    if (window.confirm("Bạn có chắc muốn xóa bài hát này?")) {
      try {
        const songId = songs[idx]._id;
        const res = await fetch(
          `http://100.98.198.23:8080/api/song/${songId}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("Lỗi xóa bài hát");
        setSongs(songs.filter((_, i) => i !== idx));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredSongs = songs.filter(
    (song) =>
      !search ||
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase())
  );

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
    ],
  };

  if (isAdmin) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          p: 6,
          fontFamily: "Roboto, Arial",
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>
            Quản lý bài hát
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1db954",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(30,215,96,0.18)",
              "&:hover": { bgcolor: "#1ed760" },
            }}
            onClick={handleOpen}
          >
            + Thêm bài hát
          </Button>
        </Box>
        <Grid container spacing={5}>
          {filteredSongs.map((song, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={idx}>
              <SongCard
                song={song}
                role={isAdmin ? "admin" : "user"}
                onEdit={() => handleEditOpen(idx)}
                onDelete={() => handleDelete(idx)}
                onPlay={() => setCurrentSong && setCurrentSong(song)}
                sx={{
                  bgcolor: "#232526",
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                  p: 2,
                  width: "100%",
                  textAlign: "center",
                  mx: "auto",
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Thêm bài hát mới</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 350,
            }}
          >
            <TextField
              label="Tên bài hát"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
            />
            <TextField
              label="Nghệ sĩ"
              name="artist"
              value={form.artist}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Thể loại"
              name="genre"
              value={form.genre || ""}
              onChange={handleChange}
              fullWidth
            />
            <label
              htmlFor="cover-upload"
              style={{ display: "block", marginBottom: 4 }}
            >
              📷 Chọn ảnh bìa:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              required
              style={{ marginBottom: 16 }}
            />
            <label
              htmlFor="audio-upload"
              style={{ display: "block", marginBottom: 4 }}
            >
              🎵 Chọn file nhạc (MP3):
            </label>
            <input
              type="file"
              accept="audio/mp3"
              onChange={handleFileChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button
              onClick={handleAdd}
              variant="contained"
              sx={{
                bgcolor: "#1db954",
                color: "#fff",
                "&:hover": { bgcolor: "#1ed760" },
              }}
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Chỉnh sửa bài hát</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 350,
            }}
          >
            <TextField
              label="Tên bài hát"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Nghệ sĩ"
              name="artist"
              value={editForm.artist}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Thể loại"
              name="genre"
              value={editForm.genre || ""}
              onChange={handleEditChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Hủy</Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              sx={{
                bgcolor: "#1db954",
                color: "#fff",
                "&:hover": { bgcolor: "#1ed760" },
              }}
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 6,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Roboto, Arial",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "linear-gradient(120deg, rgba(30,215,96,0.08) 0%, rgba(25,20,20,0.7) 100%)",
          backdropFilter: "blur(32px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          mb: 6,
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              fontSize: 38,
              fontWeight: 800,
              color: "#fff",
              mb: 1,
              letterSpacing: 1,
            }}
          >
            Khám phá nhạc mới
          </Box>
          <Box sx={{ color: "#b3b3b3", fontSize: 20 }}>
            Những bài hát nổi bật dành cho bạn
          </Box>
        </Box>
      </Box>
      <Box sx={{ position: "relative", zIndex: 1, mb: 6 }}>
        <Slider {...sliderSettings}>
          {filteredSongs.map((song, idx) => (
            <Box key={song._id || idx} sx={{ px: 1 }}>
              <SongCard
                song={song}
                role="user"
                onPlay={() => {
                  setCurrentSong && setCurrentSong(song);
                  if (typeof onUpdatePlaylist === "function") {
                    onUpdatePlaylist(filteredSongs);
                  }
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>
      <Box sx={{ position: "relative", zIndex: 1, mb: 6 }}>
        <Artists />
      </Box>
      <Box sx={{ position: "relative", zIndex: 1, mb: 6 }}>
        <Genres />
      </Box>
      <Box
        sx={{
          mt: 10,
          textAlign: "center",
          color: "#b3b3b3",
          fontSize: 16,
          opacity: 0.7,
          position: "relative",
          zIndex: 2,
        }}
      >
        © 2025 Muzic. All rights reserved.
      </Box>
      <Sidebar />
    </Box>
  );
}
