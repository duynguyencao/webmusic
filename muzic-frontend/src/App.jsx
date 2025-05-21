import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import { FavoriteProvider } from './contexts/FavoriteContext';

function App() {
    const [role, setRole] = useState('user'); // hoặc lấy từ context/localStorage

    return (
        <FavoriteProvider>
            <MainLayout role={role} setRole={setRole} />
        </FavoriteProvider>
    );
}

export default App;