import React, { useState } from "react";
import ARScene from "./components/ARScene"; // Adjust the path as necessary
import "./App.scss";
import HamburgerMenu from "./HamburgerMenu"; // Juster importbanen etter behov

function App() {
  const [logs, setLogs] = useState([]);

  const log = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  return (
    <div className="app">
      <HamburgerMenu /> {/* HamburgerMenu komponenten er lagt til her */}
      <ARScene log={log} />
      <div className="log-messages">
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
