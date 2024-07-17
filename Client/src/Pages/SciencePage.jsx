import React from "react";
import Header from "../Components/Header/Header";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import ScienceNews from "../Components/ScienceNews/ScienceNews";
import "./SciencePage.scss";

import scienceImg from "../Images/science-icon.png";

const SciencePage = () => {
  return (
    <div className="science-page">
      <Header title="Science" image={scienceImg} icon="science-icon" />
      <ScienceNews />
      <BottomTabs />
    </div>
  );
};

export default SciencePage;
