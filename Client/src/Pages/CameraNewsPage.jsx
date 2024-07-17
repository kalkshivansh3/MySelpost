import React from "react";
import Header from "../Components/Header/Header";
import CameraNews from "../Components/CameraNews/CameraNews";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import "./CameraNewsPage.scss";

import cameraImg from "../Images/camera.png";

const CameraNewsPage = () => {
  return (
    <div className="camera-news-page">
      <Header title="NewsSnap" image={cameraImg} icon="camera-news-icon" />
      <CameraNews />
      <BottomTabs />
    </div>
  );
};

export default CameraNewsPage;
