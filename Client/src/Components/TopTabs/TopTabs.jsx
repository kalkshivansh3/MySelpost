import React, { useState, useEffect } from "react";
import NationalMapsNews from "../NationalMapsNews/NationalMapsNews";
import WorldMapsNews from "../WorldMapsNews/WorldMapsNews";
import AlertPopup from "../AlertPopup/AlertPopup";
import "./TopTabs.scss";

import location from "../../Images/location.png";

const TopTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [countryText, setCountryText] = useState("America");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const countryCode = localStorage.getItem("country");
    if (!["IN", "UK", "US", "CU"].includes(countryCode)) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  
    if (countryCode === "IN") {
      setCountryText("India");
    } else if (countryCode === "US") {
      setCountryText("America");
    } else {
      setCountryText("Nation");
    }
  }, []);
  

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <>
      <div className="top-tabs-header">
        <header className="top-header">
          <div className="top-logo">
            <img src={location} alt="red map" className="top-tab-icon" />
            <h1 className="top-tab-title">Maps News</h1>
          </div>
        </header>
        <nav className="top-tabs">
          <ul className="top-tabs-list">
            <li
              className={`top-tab ${activeTab === 0 ? "active" : ""}`}
              onClick={() => handleTabClick(0)}
            >
              {countryText}
            </li>
            <li
              className={`top-tab ${activeTab === 1 ? "active" : ""}`}
              onClick={() => handleTabClick(1)}
            >
              World
            </li>
          </ul>
        </nav>

        {activeTab === 0 && <NationalMapsNews />}
        {activeTab === 1 && <WorldMapsNews />}
      </div>
      {showAlert && (
        <AlertPopup
          message="This feature will come soon for your country!"
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
};

export default TopTabs;
