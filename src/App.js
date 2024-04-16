import React, { useState } from "react";
import ARScene from "./components/ARScene";
import HamburgerMenu from "./components/HamburgerMenu";
import "./App.scss";
import LagredeKumlokk from "./components/LagredeKumlokk";
import Innstillinger from "./components/Innstillinger";
import Filtrering from "./components/Filtrering";

function App() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState("arScene");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const log = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen); // Skifter tilstanden til filtermenyen
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
      <Filtrering toggleFilter={toggleFilter} />
      {renderPage()}
      <div className="log-messages">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
