import React from 'react'
import Header from '../Components/Header/Header';
import TechnologyNews from '../Components/TechnologyNews/TechnologyNews';
import BottomTabs from '../Components/BottomTabs/BottomTabs';
import './TechnologyPage.scss';

import techImg from "../Images/server.png";

const TechnologyPage = () => {
  return (
    <div className='technology-page'>
      <Header title="Technology" image={techImg} icon="technology-icon" />
      <TechnologyNews />
      <BottomTabs />
    </div>
  )
}

export default TechnologyPage
