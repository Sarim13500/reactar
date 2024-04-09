import React, { useState, useEffect, useRef } from "react";
<<<<<<< HEAD:src/components/HamburgerMenu.js
import "./HamburgerMenu.scss";
=======
import "./HamburgerMenu.scss"; // Ensure your SCSS file path is correct
>>>>>>> ab64da2 (Denne funker med hamburgermeny, men u kan ikke navigere videre):src/HamburgerMenu.js

<<<<<<< HEAD:src/components/HamburgerMenu.js
=======
// Oppdater denne linjen for å inkludere navigateTo prop
>>>>>>> 66cdccc (Fikset slik at vi kan gp inn i kumlokk og se mock data):src/HamburgerMenu.js
const HamburgerMenu = ({ navigateTo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
<<<<<<< HEAD:src/components/HamburgerMenu.js
<<<<<<< HEAD:src/components/HamburgerMenu.js
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
=======

=======
>>>>>>> 66cdccc (Fikset slik at vi kan gp inn i kumlokk og se mock data):src/HamburgerMenu.js
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
<<<<<<< HEAD:src/components/HamburgerMenu.js
  }, []); // Empty array ensures this only runs on mount and unmount
>>>>>>> ab64da2 (Denne funker med hamburgermeny, men u kan ikke navigere videre):src/HamburgerMenu.js
=======
  }, []);
>>>>>>> 66cdccc (Fikset slik at vi kan gp inn i kumlokk og se mock data):src/HamburgerMenu.js

  const menuClass = isOpen ? "menu-items show" : "menu-items";

  const handleNavigate = (route) => {
    navigateTo(route);
    setIsOpen(false); // Close the menu when an item is clicked
  };

  return (
    <div className="hamburger-menu" ref={menuRef}>
<<<<<<< HEAD:src/components/HamburgerMenu.js
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
=======
      <button onClick={toggleMenu}>{isOpen ? "X" : "☰"}</button>
      <div className={menuClass}>
        {/* Endre onClick handleren her for å bruke navigateTo */}
        <a href="#">Hjem</a>
        <a href="#" onClick={() => navigateTo("kumlokk")}>
          Lagrede Kumlokk
        </a>
        <a href="#" onClick={() => navigateTo("innstillinger")}>
          Innstillinger
        </a>
>>>>>>> 66cdccc (Fikset slik at vi kan gp inn i kumlokk og se mock data):src/HamburgerMenu.js
      </div>
    </div>
  );
};

export default HamburgerMenu;
