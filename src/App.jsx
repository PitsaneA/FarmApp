import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Gestatie from "./pages/Gestatie";
import Video from "./pages/Video";
import Culturi from "./pages/Culturi";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gestatie" element={<Gestatie />} />
        <Route path="/video" element={<Video />} />
        <Route path="/culturi" element={<Culturi />} />
      </Routes>
    </Router>
  );
}

export default App;
