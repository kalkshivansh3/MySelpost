import React from "react";
import "./GuidelinesBox.scss";

const GuidelinesBox = ({ message, onClose, li1, li2, li3, li4 }) => {
  return (
    <div className="custom-guidelines-alert">
      <div className="custom-guidelines-alert-content">
        <p className="guidelines-alert-popup-msg">{message}</p>
        <ul className="list">
          <li className="first-two">{li1}</li>
          <li className="first-two">{li2}</li>
          <li>{li3}</li>
        </ul>
        <button onClick={onClose} className="guidelines-alert-close-btn">
          OK
        </button>
      </div>
    </div>
  );
};

export default GuidelinesBox;
