import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Create from './pages/Create';
import Preview from './pages/Preview';
import MyForms from './pages/MyForms';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function NavButton({ to, label }: { to: string; label: string }) {
  const loc = useLocation();
  const active = loc.pathname === to || loc.pathname.startsWith(to + '/');
  return <Button component={Link} to={to} color={active ? 'primary' : 'inherit'}>{label}</Button>;
}

export default function App(){
  return (
    <>
      <AppBar position="static" className="app-header" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>Form Builder</Typography>
          <NavButton to="/create" label="Create" />
          <NavButton to="/preview" label="Preview" />
          <NavButton to="/myforms" label="My Forms" />
        </Toolbar>
      </AppBar>
      <Box className="container">
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/create" element={<Create />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </Box>
    </>
  );
}
