import React from "react";
import "./FeedbackHeader.scss";

const FeedbackHeader = ({ title, image, icon }) => {
  return (
    <div className="header">
      <div className="brand-logo-cont">
        <img src={image} alt="platform logo" className={icon} />
        <h1 className="title">{title}</h1>
      </div>
    </div>
  );
};

export default FeedbackHeader;
