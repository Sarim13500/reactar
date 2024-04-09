import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ARScene from "./components/ARScene"; // Adjust the path as necessary
import HamburgerMenu from "./HamburgerMenu";
import "./App.scss";
import LagredeKumlokk from "./LagredeKumlokk";
import Filtrering from "./Filtrering";
import Innstillinger from "./Innstillinger";

function App() {
  return (
    <Router>
      <div className="app">
        <HamburgerMenu />
        <Routes>
          <Route path="/" element={<ARScene />} />
          <Route path="/lagrede-kumlokk" element={<LagredeKumlokk />} />
          <Route path="/filtrering" element={<Filtrering />} />
          <Route path="/innstillinger" element={<Innstillinger />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
