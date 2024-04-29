import React, { useState } from "react";
import ARScene from "./components/ARScene";
import HamburgerMenu from "./components/HamburgerMenu";
import "./App.scss";
import LagredeKumlokk from "./components/LagredeKumlokk";
import Innstillinger from "./components/Innstillinger";
import Filtrering from "./components/Filtrering";
import TrionaLogo from "./components/TrionaLogo";

function App() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState("arScene");

  // Define manholeData and setManholeData here
  const [manholeData, setManholeData] = useState([]); // Assuming it's an array

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
      default:
        return (
          <>
            <ARScene log={log} setManholeData={setManholeData} />
            {/* Pass manholeData and setManholeData to Filtrering */}
            <Filtrering
              manholeData={manholeData}
              setFilteredData={setManholeData}
            />
          </>
        );
    }
  };

  return (
    <div className="app">
      <TrionaLogo/>
      <HamburgerMenu navigateTo={navigateTo} />
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
