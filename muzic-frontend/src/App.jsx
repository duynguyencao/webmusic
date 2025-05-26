import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';


function App() {
    const [role, setRole] = useState('user'); 

    return (
        <MainLayout role={role} setRole={setRole} />
    );
}

export default App;