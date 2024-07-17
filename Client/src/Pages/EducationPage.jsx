import React from "react";
import Header from "../Components/Header/Header";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import EducationNews from "../Components/EducationNews/EducationNews";
import "./EducationPage.scss";

import bookImg from "../Images/books.png";

const EducationPage = () => {
  return (
    <div className="education-page">
      <Header title="Education" image={bookImg} icon="book-icon" />
      <EducationNews />
      <BottomTabs />
    </div>
  );
};

export default EducationPage;
