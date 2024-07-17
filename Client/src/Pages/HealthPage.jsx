import React from 'react'
import Header from '../Components/Header/Header';
import HealthNews from '../Components/HealthNews/HealthNews';
import BottomTabs from '../Components/BottomTabs/BottomTabs';
import './HealthPage.scss';

import healthImg from "../Images/health-icon.png";

const HealthPage = () => {
  return (
    <div className='health-page'>
      <Header title="Health" image={healthImg} icon="health-icon" />
      <HealthNews />
      <BottomTabs />
    </div>
  )
}

export default HealthPage
