import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEarthAmericas,
  faLocationDot,
  faStopwatch,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import "./BottomTabs.scss";

function BottomTabs() {
  const location = useLocation();

  return (
    <div className="bottom-tabs">
      <Link
        to="/"
        className={`tab-item ${location.pathname === "/" ? "active" : ""}`}
      >
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <Link
        to="/world-news"
        className={`tab-item ${
          location.pathname === "/world-news" ? "active" : ""
        }`}
      >
        <FontAwesomeIcon icon={faEarthAmericas} />
      </Link>
      <Link
        to="/camera-news"
        className={`tab-item ${
          location.pathname === "/camera-news" ? "active" : ""
        }`}
      >
        <FontAwesomeIcon icon={faCamera} />
      </Link>
      <Link
        to="/news-timer"
        className={`tab-item ${
          location.pathname === "/news-timer" ? "active" : ""
        }`}
      >
        <FontAwesomeIcon icon={faStopwatch} />
      </Link>
      <Link
        to="/maps-news"
        className={`tab-item ${
          location.pathname === "/maps-news" ? "active" : ""
        }`}
      >
        <FontAwesomeIcon icon={faLocationDot} />
      </Link>
    </div>
  );
}

export default BottomTabs;
