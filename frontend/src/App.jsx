import React from 'react'
import "./App.css";
import {Routes, Route } from "react-router-dom";
import Explore from './assets/pages/Explore.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/explore" element={<Explore></Explore>} />
    </Routes>
  )
}

export default App
