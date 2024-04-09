import React, { useState, useEffect, useRef } from "react";
import "./HamburgerMenu.scss"; // Ensure your SCSS file path is correct

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(); // Create a ref for the menu

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

    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty array ensures this only runs on mount and unmount

  // Use a class to control visibility of the menu items
  const menuClass = isOpen ? "menu-items show" : "menu-items";

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button onClick={toggleMenu}>
        {isOpen ? "X" : "☰"} {/* Conditional rendering for icon */}
      </button>
      <div className={menuClass}>
        {/* Menu items */}
        <a href="#">Lagrede Kumlokk</a>
        <a href="#">Innstillinger</a>
        <a href="#">Filtrering</a>
        {/* Add more links or buttons as needed */}
      </div>
    </div>
  );
};

export default HamburgerMenu;
