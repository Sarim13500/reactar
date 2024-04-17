import React from "react";
import "./Modal.scss"; // Importing the SCSS for styles

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevents click from closing modal when clicking inside
        role="dialog" // Accessibility: Identifies the div as a dialog to screen readers
        aria-modal="true" // Accessibility: Tells screen readers the modal is active
      >
        {children}
        <button
          className="close-button"
          onClick={onClose} // Handles closing the modal
          aria-label="Close modal" // Accessibility: Describes the button's action
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Modal;
