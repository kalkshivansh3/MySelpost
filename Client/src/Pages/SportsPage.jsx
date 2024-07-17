import React from "react";
import Header from "../Components/Header/Header";
import SportsNews from "../Components/SportsNews/SportsNews";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import "./SportsPage.scss";

import sportsImg from "../Images/sports-icon.png";

const SportsPage = () => {
  return (
    <div className="sports-page">
      <Header title="Sports" image={sportsImg} icon="sports-icon" />
      <SportsNews />
      <BottomTabs />
    </div>
  );
};

export default SportsPage;
