import React from "react";
import Header from "../Components/Header/Header";
import LocalNews from "../Components/LocalNews/LocalNews";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import "./HomePage.scss";

import logo from "../Images/logo.png";

const HomePage = () => {
  return (
    <div className="home-page">
      <Header title="MySelpost" image={logo} icon="header-logo" />
      <LocalNews />
      <BottomTabs />
    </div>
  );
};

export default HomePage;
