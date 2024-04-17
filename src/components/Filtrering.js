import React, { useState } from "react";
import { FiFilter } from "react-icons/fi"; // Import the Filter icon from React Icons
import "./Filtrering.scss"; // Import the styling for Filtrering component
import Modal from "./Modal"; // Import the modal component for filtering options

const Filtrering = ({ manholeData, setFilteredData }) => {
  const [showModal, setShowModal] = useState(false); // State to manage whether to show the modal
  const [filterOptions, setFilterOptions] = useState({
    type: "", // Initialize type filter as empty string to show all by default
  });

  const handleIconClick = () => {
    setShowModal(true); // Display the modal upon clicking the icon
  };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal
  };

  // Function to handle filtering logic
  const handleFiltering = () => {
    // Filter the manholeData based on filterOptions
    const filteredData = manholeData.filter((manhole) => {
      // If filterOptions.type is empty, return true for all types
      if (filterOptions.type === "") {
        return true;
      }
      // Otherwise, check if the manhole type matches the selected type
      return manhole.type === filterOptions.type;
    });
    // Update the filtered data using setFilteredData
    setFilteredData(filteredData);
    // Close the modal
    setShowModal(false);
  };

  return (
    <div className="filtrering-container">
      <div className="filter-icon" onClick={handleIconClick}>
        <FiFilter size="75" /> {/* Use the Filter icon */}
      </div>
      {/* Render the modal if showModal state is true */}
      {showModal && (
        <Modal onClose={handleModalClose}>
          {/* Filtering options in the modal */}
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
            {/* Add more options as needed */}
          </select>
          <button onClick={handleFiltering}>Apply Filters</button>
        </Modal>
      )}
    </div>
  );
};

export default Filtrering;
