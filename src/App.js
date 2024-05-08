import React, { useState } from "react";
import ARScene from "./components/ARScene";
import "./App.scss";
import LagredeKumlokk from "./components/LagredeKumlokk";
import Innstillinger from "./components/Innstillinger";
import Filtrering from "./components/Filtrering";
import TrionaLogo from "./components/TrionaLogo";
import NavigationsBar from "./components/NavigationsBar";
import Brukerveiledning from "./components/Brukerveiledning"; // Adjust the path if needed

function App() {
  const [currentPage, setCurrentPage] = useState("arScene");

  // Define manholeData and setManholeData here
  const [manholeData, setManholeData] = useState([]); // Assuming it's an array

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "lagredeKumlokk":
        return <LagredeKumlokk />;
      case "innstillinger":
        return <Innstillinger navigateTo={navigateTo} />;
      case "brukerveiledning":
        return <Brukerveiledning navigateTo={navigateTo} />;
      default:
        return (
          <>
            <TrionaLogo />
            <ARScene setManholeData={setManholeData} />
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
      {renderPage()}
      <NavigationsBar navigateTo={navigateTo} />
    </div>
  );
}

export default App;
