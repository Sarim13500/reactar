import React, { useState } from "react";
import { FaFingerprint, FaMapPin, FaBars, FaChevronDown } from "react-icons/fa";
import { GiCircleCage } from "react-icons/gi";
import "./LagredeKumlokk.scss";

const LagredeKumlokk = () => {
  const [expandedId, setExpandedId] = useState(null);

  // Hente data fra localStorage
  const storedData = localStorage.getItem("manholeData");
  const manholeData = storedData ? JSON.parse(storedData) : [];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container">
      <div className="tittel">
        <h2>Lagrede Kumlokk</h2>
      </div>
      {manholeData.length > 0 ? (
        manholeData.map((manhole) => (
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
