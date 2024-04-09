import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ARScene from "./components/ARScene"; // Adjust the path as necessary
import HamburgerMenu from "./HamburgerMenu";
import "./App.scss";
import LagredeKumlokk from "./LagredeKumlokk";
import Filtrering from "./Filtrering";
import Innstillinger from "./Innstillinger";

function App() {
  const [logs, setLogs] = useState([]);

  const log = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  return (
    <Router>
      <div className="app">
        <HamburgerMenu />
        <Routes>
          <Route path="/" element={<ARScene log={log} />} />
          <Route path="/lagrede-kumlokk" element={<LagredeKumlokk />} />
          <Route path="/filtrering" element={<Filtrering />} />
          <Route path="/innstillinger" element={<Innstillinger />} />
        </Routes>
        <div className="log-messages">
          {logs.map((logMessage, index) => (
            <div key={index}>{logMessage}</div>
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;
