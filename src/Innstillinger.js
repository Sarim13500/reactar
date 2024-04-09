// LagredeKumlokk.js
import React from "react";

// Inkluder dette i din LagredeKumlokk komponent
function Innstillinger({ onGoBack }) {
  return (
    <div>
      Dette er siden for Innstillinger.
      <button onClick={onGoBack}>Gå Tilbake</button>
    </div>
  );
}

export default Innstillinger;
