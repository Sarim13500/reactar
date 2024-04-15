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

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button onClick={toggleMenu}>{isOpen ? "X" : "☰"}</button>
      <div className={menuClass}>
        <button onClick={() => navigateTo("arScene")}>Hjem</button>
        <button onClick={() => navigateTo("lagredeKumlokk")}>
          Lagrede Kumlokk
        </button>
        <button onClick={() => navigateTo("innstillinger")}>
          Innstillinger
        </button>
        <button onClick={() => navigateTo("filtrering")}>Filtrering</button>
      </div>
    </div>
  );
};

export default HamburgerMenu;
