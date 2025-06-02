import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SongCard({ song, role, onEdit, onDelete, onPlay }) {
  return (
    <Card
      sx={{
        width: 220,
        minWidth: 220,
        maxWidth: 220,
        display: 'flex',
        flexDirection: 'column',
        height: 340,
        bgcolor: '#232526',
        borderRadius: 4,
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.03)',
          boxShadow: '0 8px 32px rgba(30,215,96,0.18)',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 180,
          overflow: 'hidden',
          borderRadius: 3,
          mx: 'auto',
          my: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          position: 'relative'
        }}
      >
        <CardMedia
          component="img"
          image={song.cover}
          alt={song.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 0
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', color: '#fff', position: 'relative', pb: 0 }}>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            fontSize: 18,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            display: 'block'
          }}
        >
          {song.title}
        </Typography>
        <Typography
          variant="subtitle2"
          color="#b3b3b3"
          noWrap
          sx={{
            fontSize: 15,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            display: 'block'
          }}
        >
          {song.artist}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
        <IconButton onClick={onPlay} sx={{ bgcolor: '#1db954', color: '#fff', '&:hover': { bgcolor: '#1ed760' }, boxShadow: '0 2px 8px rgba(30,215,96,0.18)' }}>
          <PlayArrowIcon />
        </IconButton>
      </Box>
      {role === 'admin' && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1.5,
          mb: 2,
          mt: 0.5,
        }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={onEdit}
            sx={{
              bgcolor: '#2196f3',
              color: '#fff',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
              '&:hover': { bgcolor: '#1976d2' }
            }}
          >
            Sửa
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            sx={{
              bgcolor: '#e53935',
              color: '#fff',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(229,57,53,0.10)',
              '&:hover': { bgcolor: '#b71c1c' }
            }}
          >
            Xóa
          </Button>
        </Box>
      )}
    </Card>
  );
} 