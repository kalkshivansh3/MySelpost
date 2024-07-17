import React from "react";
import Header from "../Components/Header/Header";
import BreakingNews from "../Components/BreakingNews/BreakingNews";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import "./BreakingNewsPage.scss";

import fireImg from "../Images/fire.png";

const BreakingNewsPage = () => {
  return (
    <div className="breaking-news-page">
      <Header title="Breaking News" image={fireImg} icon="breaking-news-icon" />
      <BreakingNews />
      <BottomTabs />
    </div>
  );
};

export default BreakingNewsPage;
