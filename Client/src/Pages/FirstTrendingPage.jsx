import React from "react";
import Header from "../Components/Header/Header";
import BottomTabs from "../Components/BottomTabs/BottomTabs";

import FirstTrendingNews from "../Components/FirstTrendingNews/FirstTrendingNews";

import "./FirstTrendingPage.scss";

import tank from "../Images/tank.png";

const FirstTrendingPage = () => {
  return (
    <div className="FirstTrending-page">
      <Header title="Ukraine War" image={tank} icon="war-icon" />
      <FirstTrendingNews />
      <BottomTabs />
    </div>
  );
};

export default FirstTrendingPage;
