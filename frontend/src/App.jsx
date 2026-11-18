import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home>Home Page</Home>} />
      <Route path="/explore" element={<Explore></Explore>} />
    </Routes>
  );
};

export default App;
