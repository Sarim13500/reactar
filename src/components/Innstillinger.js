import React from "react";
import {
  FaUserCircle,
  FaPalette,
FaAddressBook
} from "react-icons/fa";
import { FaRoadCircleCheck } from "react-icons/fa6";
import "../styling/Innstillinger.scss";

const Innstillinger = ({ navigateTo }) => {
  return (
    <div className="innstillinger-container">
      <h2>Innstillinger</h2>
      <div className="setting">
        <FaUserCircle />
        <span>Konto</span>
      </div>
      <div className="setting">
        <FaRoadCircleCheck />
        <span>Valg av vegobjekter</span>
      </div>
      <div className="setting" onClick={() => navigateTo("brukerveiledning")}>
        <FaAddressBook />
        <span>Brukerveiledning</span>
      </div>
      <div className="setting">
        <FaPalette />
        <span>Utseende</span>
      </div>
      
    </div>
  );
};

export default Innstillinger;
