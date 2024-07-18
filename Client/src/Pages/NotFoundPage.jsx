import React from "react";
import notFound from "../Images/notFound.jpg";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <img src={notFound} alt="each of three cartoonish people carrying 404 number" />
      <p>Image by storyset on Freepik</p>
      <BottomTabs />
    </div>
  );
};

export default NotFoundPage;
