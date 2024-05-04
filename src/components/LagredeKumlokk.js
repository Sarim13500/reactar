import React, { useState, useRef, useEffect } from "react";
import { FaFingerprint, FaMapPin, FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import { GiCircleCage } from "react-icons/gi";
import "../styling/LagredeKumlokk.scss";

const LagredeKumlokk = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const storedData = localStorage.getItem("manholeData");
  const manholeData = storedData ? JSON.parse(storedData) : [];
  const filterOptions = ["Standard kum", "Firkantkum", "Hjelpesluk", "Standard kum m sandfang"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type]);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
  };

  return (
    <div className="container">
      <div className="tittel">
        <h2>Lagrede Kumlokk</h2>
      </div>
      <div className="filter">
        <div onClick={() => setDropdownOpen(!dropdownOpen)} className="filter-dropdown">
          Filtrer på type:
          <FaChevronDown className={`dropdown-icon ${dropdownOpen ? "flipped" : ""}`} />
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            {filterOptions.map(type => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                />
                {type}
              </label>
            ))}
          </div>
        )}
      </div>
      {selectedTypes.length > 0 && (
        <div className="active-filters">
          <h4>Active Filters:</h4>
          {selectedTypes.map(type => (
            <span className="filter-tag" key={type}>
              {type} <FaTimes onClick={() => handleTypeChange(type)} />
            </span>
          ))}
          <button onClick={clearFilters}>Clear All</button>
        </div>
      )}
      {manholeData.length > 0 ? (
        manholeData
          .filter(manhole => selectedTypes.length === 0 || selectedTypes.includes(manhole.type))
          .map(manhole => (
            <div
              className={`card ${expandedId === manhole.id ? "expanded" : ""}`}
              key={manhole.id}
            >
              <div className="card-header" onClick={() => toggleExpand(manhole.id)}>
                <GiCircleCage className="kum" />
                <div className="icons-container">
                  <FaFingerprint className="icon" />
                  <FaMapPin className="icon" />
                  <FaBars className="icon" />
                </div>
                <div className="manhole-summary">
                  <div>Id: {manhole.id}</div>
                  <div>Wkt: {manhole.wkt}</div>
                  <div>Type: {manhole.type}</div>
                  <FaChevronDown className={`drop-down-icon ${expandedId === manhole.id ? "flipped" : ""}`} />
                </div>
              </div>
              {expandedId === manhole.id && (
                <div className="card-content">
                  <div>FeatureTypeId: {manhole.featureTypeId}</div>
                  <div>SubSection: {manhole.subSection}</div>
                  <div>County: {manhole.county}</div>
                  <div>Srid: {manhole.srid}</div>
                  <div>SistModifisert: {manhole.sistModifisert}</div>
                </div>
              )}
            </div>
          ))
      ) : (
        <p>Ingen lagrede kumlokk funnet.</p>
      )}
    </div>
  );
};

export default LagredeKumlokk;
