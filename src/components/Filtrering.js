import React, { useState } from "react";
import { HiAdjustments, HiX } from "react-icons/hi";
import "./Filtrering.scss";

const Filtrering = ({ manholeData, setFilteredData }) => {
  const [showModal, setShowModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ type: [] });

  const handleIconClick = () => {
    setShowModal(true);
  };

  const handleModalClose = (e) => {
    if (e) e.stopPropagation();
    setShowModal(false);
  };

  const handleCheckboxChange = (type) => {
    setFilterOptions((prevOptions) => {
      const newTypes = prevOptions.type.includes(type)
        ? prevOptions.type.filter((t) => t !== type)
        : [...prevOptions.type, type];
      return { ...prevOptions, type: newTypes };
    });
  };

  const handleFiltering = () => {
    const filteredData = manholeData.filter(
      (manhole) =>
        filterOptions.type.length === 0 ||
        filterOptions.type.includes(manhole.type)
    );
    setFilteredData(filteredData);
    setShowModal(false);
  };

  return (
    <div className="filtrering-container">
      <div
        className={`filter-icon ${showModal ? "hidden" : ""}`}
        onClick={handleIconClick}
      >
        <HiAdjustments size="75" />
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div
            className={`modal ${showModal ? "show" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <HiX className="modal-close" onClick={handleModalClose} />
            </div>
            <div className="modal-body">
              <h2>Filtrerings Valg</h2>
              <label>
                <input
                  type="checkbox"
                  checked={filterOptions.type.includes("Hjelpesluk")}
                  onChange={() => handleCheckboxChange("Hjelpesluk")}
                />{" "}
                Hjelpesluk
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filterOptions.type.includes("Firekantkum")}
                  onChange={() => handleCheckboxChange("Firekantkum")}
                />{" "}
                Firekantkum
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filterOptions.type.includes("Standard kum")}
                  onChange={() => handleCheckboxChange("Standard kum")}
                />{" "}
                Standard Kum
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filterOptions.type.includes(
                    "Standard kum m sandfang"
                  )}
                  onChange={() =>
                    handleCheckboxChange("Standard kum m sandfang")
                  }
                />{" "}
                Standard Kum m Sandfang
              </label>
              <button onClick={handleFiltering}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filtrering;
