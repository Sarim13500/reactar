import React, { useState } from "react";
import ARScene from "./components/ARScene"; // Adjust the path as necessary
import "./App.scss";
import HamburgerMenu from "./components/HamburgerMenu";
import Kumlokk from "./components/LagredeKumlokk";
import Innstillinger from "./components/Innstillinger"; // Juster importbanen etter behov

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <HamburgerMenu navigateTo={navigateTo} />
      {currentPage === "home" && <ARScene />}
      {currentPage === "kumlokk" && (
        <Kumlokk onGoBack={() => navigateTo("home")} />
      )}
      {currentPage === "innstillinger" && (
        <Innstillinger onGoBack={() => navigateTo("home")} />
      )}
    </div>
  );
}

export default App;
