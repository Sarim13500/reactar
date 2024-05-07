import React from "react";
import "../styling/Brukerveiledning.scss";
import { FaArrowLeft } from "react-icons/fa";

const Brukerveiledning = ({ navigateTo }) => {
  return (
    <div className="brukerveiledning-container">
      <button className="tilbake-knapp" onClick={() => navigateTo("innstillinger")}>
        <FaArrowLeft /> Tilbake
      </button>

      <h2>Brukerveiledning</h2>
      
      <div className="section">
        <h3>Generell veiledning</h3>
        <p>
          Dette er en kort introduksjon til hvordan du bruker applikasjonen.
          Bruk bunnnavigasjonen for å navigere mellom de forskjellige
          funksjonene. Bruk filtreringen som befinner seg øverst i høyere hjørne for å filtrere dataene etter dine
          preferanser. Du kan også filtrere de lagrede vei-objektene dine inne 
          på <button className="lagredeKumlokk-link" onClick={() => navigateTo("lagredeKumlokk")}>LagredeKumlokk</button> siden.
          På innstillingssiden finner du ulike innstillinger og informasjon du kan lese.
        </p>
      </div>
      
      <div className="section">
        <h3>FAQ</h3>
        <p>
          <strong>Spørsmål:</strong> Hvor lagres data?
          <br />
          <strong>Svar:</strong> Data vil automatisk lagres i det kamera oppserverer vegobjekter på skjermen. Du kan finne alle lagrede data ved å klikke på lagre-ikonet
          på bunnnavigasjonen i hovedsiden.
        </p>
        <p>
          <strong>Spørsmål:</strong> Hvordan endrer jeg innstillinger?
          <br />
          <strong>Svar:</strong> Gå til innstillinger fra bunnnavigasjonen og
          juster innstillingene etter behov.
        </p>
      </div>
      
      <div className="section">
        <h3>Feilsøking</h3>
        <p>
          Hvis du opplever problemer med applikasjonen, prøv å starte den på
          nytt. Hvis problemet vedvarer, kontakt Support.
        </p>
      </div>
    </div>
  );
};

export default Brukerveiledning;
