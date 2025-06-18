// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Auth/login';
import Register from './Pages/Auth/register';
import { useState } from 'react';
import MainPage from './Pages/MainPage/mainPage'; 
import VerifyCode from './Pages/Auth/verifyCode';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verifycode" element={<VerifyCode />} />
        <Route path="/dashboard" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
