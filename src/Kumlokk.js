import React from "react";
import "./Kumlokk.scss";

// Mock data for kumlokkene
const mockData = [
  {
    id: "Kumlokk 1",
    type: "Type: XXXXX",
    årstall: "Årstall: XXXX",
  },
  {
    id: "Kumlokk 2",
    type: "Type: XXXXX",
    årstall: "Årstall: XXXX",
  },
  {
    id: "Kumlokk 3",
    type: "Type: XXXXX",
    årstall: "Årstall: XXXX",
  },
];

// Komponenten for å vise lagrede kumlokk
function Kumlokk({ onGoBack }) {
  return (
    <div>
      <h2>Lagrede Kumlokk</h2>
      <div>
        {mockData.map((kumlokk, index) => (
          <div key={index}>
            <h3>{kumlokk.id}</h3>
            <p>{kumlokk.type}</p>
            <p>{kumlokk.årstall}</p>
          </div>
        ))}
      </div>
      <button onClick={onGoBack}>Gå Tilbake</button>
    </div>
  );
}

export default Kumlokk;
