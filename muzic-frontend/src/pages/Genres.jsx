import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import GenreCard from "../components/GenreCard";
import { Box, Typography } from "@mui/material";

export default function Genres() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetch("http://100.98.198.23:8080/api/genre")
      .then((res) => res.json())
      .then((data) => setGenres(data));
  }, []);

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
      { breakpoint: 400, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Box>
    <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
            sx={{
            color: "#fff",
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: 20, md: 24 },
            letterSpacing: 0.5,
          }}
        >
          Thể loại
        </Typography>
      </Box>
      <Box>
        <Slider {...sliderSettings}>
          {genres.map((genre) => (
            <Box key={genre.id} sx={{ px: 1, display: 'flex', justifyContent: 'center' }}>
              <GenreCard genre={genre} />
          </Box>
        ))}
        </Slider>
      </Box>
    </Box>
  );
} 
