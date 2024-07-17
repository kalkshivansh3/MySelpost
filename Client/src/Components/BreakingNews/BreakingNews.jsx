import React, { useState } from "react";

import test1 from "../../Images/test1.jpg";
import test2 from "../../Images/test2.jpg";

import "./BreakingNews.scss";

const headlines = [
  "First Headline",
  "Second Headline",
  "Third Headline",
  "Fourth Headline",
  "Fifth Headline",
  "Sixth Headline",
  "First Headline",
  "Second Headline",
  "Third Headline",
  "Fourth Headline",
  "Fifth Headline",
  "Sixth Headline",
];

const BreakingNews = () => {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="breaking-news-section">
      <div className="main-breaking-news">
        <img src={test1} alt="" className="test-img" />
        <div className="top-headline-cont">
          <h3 className="main-breaking-headline">Breaking</h3>
          <p className="main-breaking-paragraph">
            Lorem ipsum dolor, sit amet consectetur
          </p>
        </div>
      </div>
      <div className="breaking-news-container">
        {headlines.map((headline, index) => (
          <div
            key={index}
            className={`paper ${showPopup ? "" : "popup-hidden"}`}
          >
            <div className="pin">
              {/*<div className="shadow"></div>
              <div className="metal"></div>
              <div className="bottom-circle"></div>
              <img src={} alt="" />*/}
              <p>{headline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreakingNews;
