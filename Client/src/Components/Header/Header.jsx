import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Menu from "../Menu/Menu";
import "./Header.scss";

const Header = ({ title, image, icon }) => {
  return (
    <div className="header">
      <div className="brand-logo-cont">
        <img src={image} alt="platform logo" className={icon} />
        <h1 className="title">{title}</h1>
      </div>
      <div className="icons-cont">
        <Link to="/feedback">
          <FontAwesomeIcon
            icon={faStar}
            color="#fff"
            className="review-icon"
          />
        </Link>
        <Menu />
      </div>
    </div>
  );
};

export default Header;
