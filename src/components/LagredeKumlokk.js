import React, { useState } from "react";
import { FaFingerprint, FaMapPin, FaBars, FaChevronDown } from "react-icons/fa";
import { GiCircleCage } from "react-icons/gi";
import "./LagredeKumlokk.scss";

const LagredeKumlokk = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  // Hente data fra localStorage
  const storedData = localStorage.getItem("manholeData");
  const manholeData = storedData ? JSON.parse(storedData) : [];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="container">
      <div className="tittel">
        <h2>Lagrede Kumlokk</h2>
      </div>
      <div className="filter">
        <label htmlFor="typeFilter">Filtrer på type:</label>
        <select
          id="typeFilter"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="">Alle Typer</option>
          <option value="Standard kum">Standard kum</option>
          <option value="Firekantkum">Firekantkum</option>
          <option value="Hjelpesluk">Hjelpesluk</option>
          <option value="Standard kum m sandfang">
            Standard kum m sandfang
          </option>
        </select>
      </div>
      {manholeData.length > 0 ? (
        manholeData
          .filter((manhole) => !selectedType || manhole.type === selectedType)
          .map((manhole) => (
            <div
              className={`card ${expandedId === manhole.id ? "expanded" : ""}`}
              key={manhole.id}
            >
              <div
                className="card-header"
                onClick={() => toggleExpand(manhole.id)}
              >
                <div>
                  <GiCircleCage className="kum" />
                </div>
                <div className="icons-container">
                  <FaFingerprint className="icon" />
                  <FaMapPin className="icon" />
                  <FaBars className="icon" />
                </div>
                <div className="manhole-summary">
                  <div>Id: {manhole.id}</div>
                  <div>Wkt: {manhole.wkt}</div>
                  <div>Type: {manhole.type}</div>
                </div>

                <FaChevronDown
                  className={`drop-down-icon ${
                    expandedId === manhole.id ? "flipped" : ""
                  }`}
                />
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
