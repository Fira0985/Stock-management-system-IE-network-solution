// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Auth/login';
import { useState } from 'react';
import MainPage from './Pages/MainPage/mainPage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
