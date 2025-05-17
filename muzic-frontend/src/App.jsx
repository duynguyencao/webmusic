import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';

function App() {
    const [role, setRole] = useState('user'); // hoặc lấy từ context/localStorage

    return (
        <MainLayout role={role} setRole={setRole} />
    );
}

export default App;