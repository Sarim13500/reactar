import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link component
import "./HamburgerMenu.scss";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(); // Create a ref for the menu

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
        <Link to="/lagrede-kumlokk" onClick={() => setIsOpen(false)}>
          Lagrede Kumlokk
        </Link>
        <Link to="/filtrering" onClick={() => setIsOpen(false)}>
          Filtrering
        </Link>
        <Link to="/innstillinger" onClick={() => setIsOpen(false)}>
          Innstillinger
        </Link>
      </div>
    </div>
  );
};

export default HamburgerMenu;
