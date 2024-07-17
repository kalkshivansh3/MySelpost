import React from "react";
import Header from "../Components/Header/Header";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import EntertainmentNews from "../Components/EntertainmentNews/EntertainmentNews";
import "./EntertainmentPage.scss";

import cinemaImg from "../Images/film-reel.png";

const EntertainmentPage = () => {
  return (
    <div className="entertainment-page">
      <Header title="Entertainment" image={cinemaImg} icon="cinema-icon" />
      <EntertainmentNews />
      <BottomTabs />
    </div>
  );
};

export default EntertainmentPage;
