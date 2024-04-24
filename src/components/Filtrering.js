import React, { useState } from "react";
import { HiAdjustments, HiX } from "react-icons/hi"; // Importing HiX for the close icon
import "./Filtrering.scss"; // Ensure this includes all necessary styles from Modal.scss

const Filtrering = ({ manholeData, setFilteredData }) => {
  const [showModal, setShowModal] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ type: "" });

  const handleIconClick = () => {
    setShowModal(true);
  };

  const handleModalClose = (e) => {
    if (e) e.stopPropagation(); // Prevents the modal from closing when clicking inside the modal jaja
    setShowModal(false);
  };

  const handleFiltering = () => {
    const filteredData = manholeData.filter(
      (manhole) =>
        filterOptions.type === "" || manhole.type === filterOptions.type
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
              <select
                value={filterOptions.type}
                onChange={(e) =>
                  setFilterOptions({ ...filterOptions, type: e.target.value })
                }
              >
                <option value="">All Kumlokk</option>
                <option value="hjelpesluk">Hjelpesluk</option>
                <option value="firekantkum">Firekantkum</option>
                <option value="Standard kum">Standard Kum</option>
                <option value="Standard kum m sandfang">
                  Standard Kum m Sandfang
                </option>
              </select>
              <button onClick={handleFiltering}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filtrering;
