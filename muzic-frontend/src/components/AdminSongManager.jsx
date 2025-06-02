import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const AdminSongManager = ({ user, search, onPlay }) => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [editSong, setEditSong] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    artist: "",
    genre: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ title: "", artist: "", genre: "" });
  const [file, setFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [artistFile, setArtistFile] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (user?.username === "admin") {
      fetchAllSongs();
      fetchArtists();
      fetchGenres();
    }
  }, [user]);

  const fetchAllSongs = async () => {
    const res = await fetch("http://100.98.198.23:8080/api/song");
    const data = await res.json();
    setSongs(data);
  };

  const fetchArtists = async () => {
    const res = await fetch("http://100.98.198.23:8080/api/artist");
    const data = await res.json();
    setArtists(data);
  };

  const fetchGenres = async () => {
    const res = await fetch("http://100.98.198.23:8080/api/genre");
    const data = await res.json();
    setGenres(data);
  };

  // Xóa 1 bài hát
  const handleDeleteSong = async (songId) => {
    await fetch(`http://100.98.198.23:8080/api/song/${songId}`, {
      method: "DELETE",
    });
    setSongs(songs.filter((song) => song._id !== songId));
  };

  // Xóa tất cả bài hát của nghệ sĩ
  const handleDeleteArtistAlbum = async () => {
    await fetch(
      `http://100.98.198.23:8080/api/artist/${encodeURIComponent(
        selectedArtist
      )}`,
      { method: "DELETE" }
    );
    setSongs(songs.filter((song) => song.artist !== selectedArtist));
  };

  // Xóa tất cả bài hát của thể loại
  const handleDeleteGenreAlbum = async () => {
    try {
      const res = await fetch(
        `http://100.98.198.23:8080/api/genre/${encodeURIComponent(
          selectedGenre
        )}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete genre");
      setSongs(songs.filter((song) => song.genre !== selectedGenre));
      setSelectedGenre(""); // Reset selection
    } catch (error) {
      console.error("Error deleting genre:", error);
      alert("Lỗi khi xóa thể loại: " + error.message);
    }
  };

  // Sửa bài hát
  const handleEditSong = (song) => {
    setEditSong(song);
    setEditForm({ title: song.title, artist: song.artist, genre: song.genre });
    setEditOpen(true);
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFormSubmit = async () => {
    await fetch(`http://100.98.198.23:8080/api/song/${editSong._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setSongs(
      songs.map((s) => (s._id === editSong._id ? { ...s, ...editForm } : s))
    );
    setEditOpen(false);
    setEditSong(null);
  };

  // Thêm bài hát mới
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => {
    setAddOpen(false);
    setAddForm({ title: "", artist: "", genre: "" });
    setFile(null);
    setCoverFile(null);
    setArtistFile(null);
  };
  const handleAddFormChange = (e) =>
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleCoverChange = (e) => setCoverFile(e.target.files[0]);
  const handleArtistChange = (e) => setArtistFile(e.target.files[0]);

  const handleAddSong = async () => {
    if (addForm.title && addForm.artist && file && coverFile) {
      setAdding(true);
      try {
        const formData = new FormData();
        formData.append("title", addForm.title);
        formData.append("artist", addForm.artist);
        if (addForm.genre) formData.append("genre", addForm.genre);
        formData.append("track", file);
        formData.append("cover", coverFile);
        formData.append("image_artist", artistFile);
        const res = await fetch("http://100.98.198.23:8080/api/song", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Lỗi thêm bài hát");
        const result = await res.json();
        if (result.success && result.song) {
          setSongs([result.song, ...songs]);
        } else {
          fetchAllSongs();
        }
        handleAddClose();
      } catch (err) {
        alert("Lỗi: " + (err.message || err));
        console.error(err);
      } finally {
        setAdding(false);
      }
    } else {
      alert(
        "Vui lòng nhập đầy đủ tên bài hát, nghệ sĩ, chọn file mp3 và ảnh bìa!"
      );
    }
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, color: "#fff", mb: 3, letterSpacing: 1 }}
      >
        Quản lý bài hát (Admin)
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          mb: 3,
          bgcolor: "#1db954",
          fontWeight: 700,
          "&:hover": { bgcolor: "#1ed760" },
        }}
        onClick={handleAddOpen}
      >
        Thêm bài hát mới
      </Button>
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>Thêm bài hát mới</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            label="Tên bài hát"
            name="title"
            value={addForm.title}
            onChange={handleAddFormChange}
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            label="Nghệ sĩ"
            name="artist"
            value={addForm.artist}
            onChange={handleAddFormChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Thể loại"
            name="genre"
            value={addForm.genre || ""}
            onChange={handleAddFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <InputLabel sx={{ mt: 1 }}>Ảnh Nghệ sĩ</InputLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleArtistChange}
            style={{ marginBottom: 16 }}
          />
          <InputLabel sx={{ mt: 1 }}>Ảnh bìa</InputLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            style={{ marginBottom: 16 }}
          />
          <InputLabel sx={{ mt: 2 }}>File nhạc (MP3)</InputLabel>
          <input type="file" accept="audio/mp3" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Hủy</Button>
          <Button
            onClick={handleAddSong}
            variant="contained"
            disabled={adding}
            sx={{ bgcolor: "#1db954", "&:hover": { bgcolor: "#1ed760" } }}
          >
            {adding ? "Đang thêm..." : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer
        component={Paper}
        sx={{
          background: "#181818",
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          borderRadius: 3,
          mt: 2,
          maxHeight: 64 * 7 + 56, // 7 dòng + header (56px)
          overflowY: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#b3b3b3", fontWeight: 700 }}>
                #
              </TableCell>
              <TableCell sx={{ color: "#b3b3b3", fontWeight: 700 }}>
                Bìa
              </TableCell>
              <TableCell sx={{ color: "#b3b3b3", fontWeight: 700 }}>
                Tên bài hát
              </TableCell>
              <TableCell sx={{ color: "#b3b3b3", fontWeight: 700 }}>
                Nghệ sĩ
              </TableCell>
              <TableCell sx={{ color: "#b3b3b3", fontWeight: 700 }}>
                Thể loại
              </TableCell>
              <TableCell sx={{ color: "#b3b3b3", fontWeight: 700 }}>
                Sửa
              </TableCell>
              <TableCell sx={{ color: "#b3b3b3", fontWeight: 700 }}>
                Xóa
              </TableCell>
              <TableCell sx={{ color: "#b3b3b3", fontWeight: 700 }}>
                Phát
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSongs.map((song, idx) => (
              <TableRow
                key={song._id}
                hover
                sx={{ "&:hover": { bgcolor: "rgba(30,215,96,0.06)" } }}
              >
                <TableCell sx={{ color: "#fff" }}>{idx + 1}</TableCell>
                <TableCell>
                  <Avatar src={song.cover} alt={song.title} variant="rounded" />
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>{song.title}</TableCell>
                <TableCell sx={{ color: "#b3b3b3" }}>{song.artist}</TableCell>
                <TableCell sx={{ color: "#b3b3b3" }}>{song.genre}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditSong(song)}
                    sx={{ color: "#2196f3" }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDeleteSong(song._id)}
                    sx={{ color: "#e53935" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => onPlay(song)}
                    sx={{
                      bgcolor: "#1db954",
                      color: "#fff",
                      "&:hover": { bgcolor: "#1ed760" },
                      boxShadow: "0 2px 8px rgba(30,215,96,0.18)",
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

      <Box sx={{ display: "flex", gap: 6, mt: 6, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Xóa album nghệ sĩ
          </Typography>
          <Select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            displayEmpty
            sx={{
              width: 300,
              mb: 2,
              bgcolor: "#232526",
              color: "#fff",
              borderRadius: 2,
            }}
            MenuProps={{
              PaperProps: { sx: { bgcolor: "#232526", color: "#fff" } },
            }}
          >
            <MenuItem value="">Chọn nghệ sĩ</MenuItem>
            {artists.map((artist) => (
              <MenuItem key={artist.name} value={artist.name}>
                {artist.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="error"
            disabled={!selectedArtist}
            onClick={handleDeleteArtistAlbum}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Xóa tất cả bài hát của nghệ sĩ này
          </Button>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
            Xóa album thể loại
          </Typography>
          <Select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            displayEmpty
            sx={{
              width: 300,
              mb: 2,
              bgcolor: "#232526",
              color: "#fff",
              borderRadius: 2,
            }}
            MenuProps={{
              PaperProps: { sx: { bgcolor: "#232526", color: "#fff" } },
            }}
          >
            <MenuItem value="">Chọn thể loại</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.name} value={genre.name}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="error"
            disabled={!selectedGenre}
            onClick={handleDeleteGenreAlbum}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Xóa tất cả bài hát của thể loại này
          </Button>
        </Box>
      </Box>

      {/* Dialog sửa bài hát */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Sửa bài hát</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <TextField
            label="Tên bài hát"
            name="title"
            value={editForm.title}
            onChange={handleEditFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Nghệ sĩ"
            name="artist"
            value={editForm.artist}
            onChange={handleEditFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Thể loại"
            name="genre"
            value={editForm.genre}
            onChange={handleEditFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Hủy</Button>
          <Button onClick={handleEditFormSubmit} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSongManager;
