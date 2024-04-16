import React, { useState, useRef, useEffect } from "react";
import "./Filtrering.scss";
import { FaFilter, FaTimes } from "react-icons/fa";

const Filtrering = () => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef();

  useEffect(() => {
    // Håndterer klikk utenfor filtermenyen for å lukke den
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFilter = () => {
    console.log("Filter was:", isOpen); // Logg nåværende tilstand før endring
    setIsOpen(!isOpen);
    console.log("Filter changed to:", isOpen); // Logg tilstanden etter endring (vil vise forrige tilstand pga. asynkronitet)
  };

  return (
    <div className="filter-menu" ref={filterRef}>
      <button onClick={toggleFilter} className="filter-icon">
        {isOpen ? <FaTimes /> : <FaFilter />}
      </button>
      {isOpen && (
        <div className="filter-items">
          {/* Her vises faktiske filteralternativer når isOpen er true */}
          <button onClick={() => console.log("Filter 1")}>Filter 1</button>
          <button onClick={() => console.log("Filter 2")}>Filter 2</button>
          <button onClick={() => console.log("Filter 3")}>Filter 3</button>
        </div>
      )}
    </div>
  );
};

export default Filtrering;
