import React, { useState, useRef, useEffect } from "react";
import "./Filtrering.scss";

const Filtrering = () => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef();

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterClass = isOpen ? "filter-items show" : "filter-items";

  return (
    <div className="filter-menu" ref={filterRef}>
      <button onClick={toggleFilter}>{isOpen ? "Lukk" : "Filter"}</button>
      <div className={filterClass}>
        {/* Filter options */}
        <button onClick={() => console.log("Filter 1")}>Filter 1</button>
        <button onClick={() => console.log("Filter 2")}>Filter 2</button>
      </div>
    </div>
  );
};

export default Filtrering;
