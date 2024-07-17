import React from "react";
import Header from "../Components/Header/Header";
import BottomTabs from "../Components/BottomTabs/BottomTabs";

import SecondTrendingNews from "../Components/SecondTrendingNews/SecondTrendingNews";

import "./SecondTrendingPage.scss";

import tank from "../Images/tank.png";

const SecondTrendingPage = () => {
  return (
    <div className="SecondTrending-page">
      <Header title="Israel War" image={tank} icon="war-icon" />
      <SecondTrendingNews />
      <BottomTabs />
    </div>
  );
};

export default SecondTrendingPage;
