import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [register, setRegister] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://100.98.198.23:8080/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      console.log('login data:', data);
      if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại');
      onLogin({ username: data.username, _id: data._id });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    
    if (register.password !== register.confirmPassword) {
      setRegisterError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const res = await fetch('http://100.98.198.23:8080/api/user/register', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: register.username,
          password: register.password
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Đăng ký thất bại');
      }
      const loginRes = await fetch('http://100.98.198.23:8080/api/user/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
          username: register.username,
          password: register.password
        }),
      });

      if (loginRes.ok) {
        const userData = await loginRes.json();
        onLogin(userData);
        navigate('/');
      }
    } catch (err) {
      setRegisterError(err.message);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(30,215,96,0.12) 0%, rgba(25,20,20,0.85) 100%)',
    }}>
      <Box component="form" onSubmit={isLogin ? handleLogin : handleRegister} sx={{
        p: 4,
        minWidth: 350,
        bgcolor: 'rgba(24,24,24,0.92)',
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#fff', fontWeight: 700 }}>
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </Typography>
        
        {isLogin ? (
          <>
            {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
            <TextField
              label="Tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#b3b3b3' } }}
              InputLabelProps={{ style: { color: '#b3b3b3' } }}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#b3b3b3' } }}
              InputLabelProps={{ style: { color: '#b3b3b3' } }}
            />
          </>
        ) : (
          <>
            {registerError && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{registerError}</Alert>}
            <TextField
              label="Tên đăng nhập"
              value={register.username}
              onChange={e => setRegister({...register, username: e.target.value})}
              fullWidth
              required
              sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#b3b3b3' } }}
              InputLabelProps={{ style: { color: '#b3b3b3' } }}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={register.password}
              onChange={e => setRegister({...register, password: e.target.value})}
              fullWidth
              required
              sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#b3b3b3' } }}
              InputLabelProps={{ style: { color: '#b3b3b3' } }}
            />
            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              value={register.confirmPassword}
              onChange={e => setRegister({...register, confirmPassword: e.target.value})}
              fullWidth
              required
              sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#b3b3b3' } }}
              InputLabelProps={{ style: { color: '#b3b3b3' } }}
            />
          </>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, fontSize: 18, py: 1.2 }}>
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </Button>

        <Link
          component="button"
          variant="body2"
          onClick={() => setIsLogin(!isLogin)}
          sx={{ mt: 2, color: '#b3b3b3', textDecoration: 'none' }}
        >
          {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
        </Link>
      </Box>
    </Box>
  );
} 