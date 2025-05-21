import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) return;
    fetch(`http://localhost:5000/api/user/${userId}/favorites`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setFavorites(data))
      .catch(() => setFavorites([]));
  }, []);

  const toggleFavorite = async (song) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) return;
    const isFav = favorites.some(fav => fav._id === song._id);
    if (isFav) {
      await fetch(`http://localhost:5000/api/user/${userId}/favorites/${song._id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
    } else {
      await fetch(`http://localhost:5000/api/user/${userId}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ songId: song._id })
      });
    }
    // Refetch favorites
    const res = await fetch(`http://localhost:5000/api/user/${userId}/favorites`, {
      headers: { Authorization: 'Bearer ' + token }
    });
    setFavorites(await res.json());
  };

  const isFavorite = (song) => {
    return favorites.some(fav => fav._id === song._id);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
} 