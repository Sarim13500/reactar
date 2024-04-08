import React, { useState } from "react";
import "./HamburgerMenu.scss"; // Anta at du har en egen SCSS-fil for styling

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="hamburger-button" onClick={toggleMenu}>
        ☰
      </button>
      {isOpen && (
        <div className="menu">
          <a href="#section1">Link 1</a>
          <a href="#section2">Link 2</a>
          <a href="#section3">Link 3</a>
        </div>
      )}
    </div>
  );
}

export default HamburgerMenu;
