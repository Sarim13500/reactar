import React, { useState } from "react";
import { FaCamera, FaCog, FaArchive } from "react-icons/fa"; // Import Font Awesome icons
import { FiSettings, FiArchive, FiCamera } from "react-icons/fi"; // Import Feather icons
import "../styling/Bottomnavigation.scss"; // Your own CSS for styling

const BottomNavigation = ({ navigateTo }) => {
  // State to track which icon is currently active
  const [activeIcon, setActiveIcon] = useState("arScene");

  // Function to handle icon click and navigation
  const handleIconClick = (iconName) => {
    setActiveIcon(iconName); // Update the active icon state
    navigateTo(iconName); // Navigate to the corresponding page
  };

  return (
    <div className="bottom-navigation">
      {/* Conditionally render the icons based on the activeIcon state */}
      {activeIcon === "lagredeKumlokk" ? (
        <FaArchive
          className="nav-icon"
          onClick={() => handleIconClick("lagredeKumlokk")}
        />
      ) : (
        <FiArchive
          className="nav-icon"
          onClick={() => handleIconClick("lagredeKumlokk")}
        />
      )}
      {activeIcon === "arScene" ? (
        <FaCamera
          className="nav-icon"
          onClick={() => handleIconClick("arScene")}
        />
      ) : (
        <FiCamera
          className="nav-icon"
          onClick={() => handleIconClick("arScene")}
        />
      )}
      {activeIcon === "innstillinger" ? (
        <FaCog
          className="nav-icon"
          onClick={() => handleIconClick("innstillinger")}
        />
      ) : (
        <FiSettings
          className="nav-icon"
          onClick={() => handleIconClick("innstillinger")}
        />
      )}
    </div>
  );
};

export default BottomNavigation;
