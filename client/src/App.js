import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MultiplayerGame from "./MultiplayerGame";
import SinglePlayerGame from "./SingleplayerGame";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SinglePlayerGame" element={<SinglePlayerGame />} />
        <Route path="/MultiplayerGame" element={<MultiplayerGame />} />
      </Routes>
    </Router>
  );
}

export default App;
