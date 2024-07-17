import React from "react";
import TopTabs from "../Components/TopTabs/TopTabs";
import NationalMapsNews from "../Components/NationalMapsNews/NationalMapsNews";
import BottomTabs from "../Components/BottomTabs/BottomTabs";

import "./MapsPage.scss";

const MapsPage = () => {
  return (
    <div>
      <TopTabs />
      <NationalMapsNews />
      <BottomTabs />
    </div>
  );
};

export default MapsPage;
