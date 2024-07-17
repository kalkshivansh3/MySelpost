import React from "react";
import Header from "../Components/Header/Header";
import NewsTimer from "../Components/NewsTimer/NewsTimer";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import "./NewsTimerPage.scss";

import timer from "../Images/timer.png";

const NewsTimerPage = () => {
  return (
    <div className="news-timer-page">
      <Header title="News Timer" image={timer} icon="news-timer-icon" />
      <NewsTimer />
      <BottomTabs />
    </div>
  );
};

export default NewsTimerPage;
