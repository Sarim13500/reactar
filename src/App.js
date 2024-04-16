import React, { useState } from "react";
import ARScene from "./components/ARScene";
import HamburgerMenu from "./components/HamburgerMenu";
import "./App.scss";
import LagredeKumlokk from "./components/LagredeKumlokk";
import Innstillinger from "./components/Innstillinger";
import Filtrering from "./components/Filtrering";
import { FaFilter } from "react-icons/fa";

function App() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState("arScene");

  const log = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "lagredeKumlokk":
        return <LagredeKumlokk />;
      case "innstillinger":
        return <Innstillinger />;
      case "filtrering":
        return <Filtrering />;
      default:
        return <ARScene log={log} />;
    }
  };

  return (
    <div className="app">
      <HamburgerMenu navigateTo={navigateTo} />
      {renderPage()}
      <div className="filter-icon" onClick={() => navigateTo("filtrering")}>
        <FaFilter /> // Filterikonet
      </div>
      <div className="log-messages">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
