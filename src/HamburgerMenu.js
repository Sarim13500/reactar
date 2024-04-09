import React, { useState, useEffect, useRef } from "react";
import "./HamburgerMenu.scss"; // Ensure your SCSS file path is correct

// Oppdater denne linjen for å inkludere navigateTo prop
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuClass = isOpen ? "menu-items show" : "menu-items";

  return (
    <div className="hamburger-menu" ref={menuRef}>
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
      </div>
    </div>
  );
};

export default HamburgerMenu;
