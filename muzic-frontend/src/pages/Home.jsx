import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SongCard from "../components/SongCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Artists from "./Artists";
import Genres from "./Genres";
import AdminSongManager from "../components/AdminSongManager";
import Sidebar from "../components/Sidebar";

export default function Home({
  user,
  setCurrentSong,
  search,
  onUpdatePlaylist,
  ...props
}) {
  const isAdmin = user && user.username === "admin";

  const [songs, setSongs] = useState([]);

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
      <Box sx={{ minHeight: "100vh", p: 6, fontFamily: "Roboto, Arial" }}>
        <AdminSongManager user={user} search={search}
          onPlay={
            (song) => {
              setCurrentSong && setCurrentSong(song);
            }
          }
        />
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
