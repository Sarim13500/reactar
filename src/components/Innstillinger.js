import React from "react";
import { FaUser, FaCog, FaBell } from "react-icons/fa";
import "./Innstillinger.scss"; // Import the styling for Innstillinger component

const Innstillinger = () => {
  return (
    <div className="innstillinger-container">
      <h2>Settings</h2>
      <div className="setting">
        <div className="setting-icon">
          <FaUser />
        </div>
        <div className="setting-name">Profile</div>
      </div>
      <div className="setting">
        <div className="setting-icon">
          <FaCog />
        </div>
        <div className="setting-name">General</div>
      </div>
      <div className="setting">
        <div className="setting-icon">
          <FaBell />
        </div>
        <div className="setting-name">Notifications</div>
      </div>
      {/* Add more settings as needed */}
    </div>
  );
};

export default Innstillinger;
