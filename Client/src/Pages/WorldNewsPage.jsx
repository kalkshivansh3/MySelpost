import React from 'react'

import Header from "../Components/Header/Header";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import WorldNews from '../Components/WorldNews/WorldNews';

import world from "../Images/world.png";

import './WorldNewsPage.scss';

const WorldNewsPage = () => {
  return (
    <div>
      <Header title="World News" image={world} icon="world-news-icon" />
      <WorldNews />
      <BottomTabs />
    </div>
  )
}

export default WorldNewsPage
