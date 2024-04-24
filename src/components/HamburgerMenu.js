import React, { useState, useEffect, useRef } from "react";
import "./HamburgerMenu.scss";

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuClass = isOpen ? "menu-items show" : "menu-items";

  const handleNavigate = (route) => {
    navigateTo(route);
    setIsOpen(false); // Close the menu when an item is clicked
  };

  return (
    <div className="hamburger-menu" ref={menuRef}>
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
      </div>
    </div>
  );
};

export default HamburgerMenu;