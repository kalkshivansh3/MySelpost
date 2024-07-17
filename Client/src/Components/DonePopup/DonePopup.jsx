import React from "react";
import "./DonePopup.scss";

const AlertPopup = ({ message, onClose }) => {
  return (
    <div className="custom-done-alert">
      <div className="custom-done-alert-content">
        <p className="done-alert-popup-msg">{message}</p>
        <button onClick={onClose} className="done-alert-close-btn">DONE</button>
      </div>
    </div>
  );
};

export default AlertPopup;
