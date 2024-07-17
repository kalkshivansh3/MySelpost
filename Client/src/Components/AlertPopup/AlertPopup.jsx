import React from "react";
import "./AlertPopup.scss";

const AlertPopup = ({ message, onClose }) => {
  return (
    <div className="custom-alert">
      <div className="custom-alert-content">
        <p className="alert-popup-msg">{message}</p>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default AlertPopup;
