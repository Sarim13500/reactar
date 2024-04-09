import React, { useState, useEffect, useRef } from "react";
<<<<<<< HEAD:src/components/HamburgerMenu.js
import "./HamburgerMenu.scss";
=======
import "./HamburgerMenu.scss"; // Ensure your SCSS file path is correct
>>>>>>> ab64da2 (Denne funker med hamburgermeny, men u kan ikke navigere videre):src/HamburgerMenu.js

const HamburgerMenu = ({ navigateTo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to close the menu if the clicked target is outside of the menu container
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Use effect to add an event listener to the document
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
<<<<<<< HEAD:src/components/HamburgerMenu.js
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
=======

    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty array ensures this only runs on mount and unmount
>>>>>>> ab64da2 (Denne funker med hamburgermeny, men u kan ikke navigere videre):src/HamburgerMenu.js

  // Use a class to control visibility of the menu items
  const menuClass = isOpen ? "menu-items show" : "menu-items";

  const handleNavigate = (route) => {
    navigateTo(route);
    setIsOpen(false); // Close the menu when an item is clicked
  };

  return (
    <div className="hamburger-menu" ref={menuRef}>
<<<<<<< HEAD:src/components/HamburgerMenu.js
      <button onClick={toggleMenu} className="menu-button">
        {isOpen ? "X" : "☰"}
      </button>
      <div className={menuClass}>
        <button onClick={() => handleNavigate("arScene")}>Hjem</button>
        <button onClick={() => handleNavigate("lagredeKumlokk")}>
          Lagrede Kumlokk
        </button>
        <button onClick={() => handleNavigate("innstillinger")}>
          Innstillinger
        </button>
=======
      <button onClick={toggleMenu}>
        {isOpen ? "X" : "☰"} {/* Conditional rendering for icon */}
      </button>
      <div className={menuClass}>
        {/* Menu items */}
        <a href="#">Lagrede Kumlokk</a>
        <a href="#">Innstillinger</a>
        <a href="#">Filtrering</a>
        {/* Add more links or buttons as needed */}
>>>>>>> ab64da2 (Denne funker med hamburgermeny, men u kan ikke navigere videre):src/HamburgerMenu.js
      </div>
    </div>
  );
};

export default HamburgerMenu;
