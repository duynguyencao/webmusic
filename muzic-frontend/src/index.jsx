import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1db954' },
    secondary: { main: '#191414' },
  },
  typography: { fontFamily: 'Roboto, Arial' },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StylesThemeProvider theme={theme}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MuiThemeProvider>
    </StylesThemeProvider>
  </React.StrictMode>
);