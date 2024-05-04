import React from "react";
import {
  FaUserCircle,
  FaLink,
  FaPalette,
  FaShieldAlt,
  FaDatabase,
  FaQuestionCircle,FaAddressBook
} from "react-icons/fa";
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
        <FaPalette />
        <span>Utsende</span>
      </div>
      <div className="setting" onClick={() => navigateTo("brukerveiledning")}>
        <FaAddressBook />
        <span>Brukerveiledning</span>
      </div>
      <div className="setting">
        <FaShieldAlt />
        <span>Personvern</span>
      </div>
      <div className="setting">
        <FaDatabase />
        <span>Data og lagring</span>
      </div>
      <div className="setting">
        <FaQuestionCircle />
        <span>Hjelp</span>
      </div>
    </div>
  );
};

export default Innstillinger;
