import React, { useState } from "react";
import ARScene from "./components/ARScene"; // Adjust the path as necessary
import "./App.scss";

function App() {
  const [logs, setLogs] = useState([]);

  const log = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  return (
    <div className="app">
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
