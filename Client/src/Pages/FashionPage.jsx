import React from "react";
import Header from "../Components/Header/Header";
import BottomTabs from "../Components/BottomTabs/BottomTabs";

import FashionNews from "../Components/FashionNews/FashionNews";

import "./FashionPage.scss";

import bagImg from "../Images/handbag-icon.png";

const FashionPage = () => {
  return (
    <div className="fashion-page">
      <Header title="Fashion" image={bagImg} icon="fashion-icon" />
      <FashionNews />
      <BottomTabs />
    </div>
  );
};

export default FashionPage;
