import React from 'react'
import Header from '../Components/Header/Header';
import BusinessNews from '../Components/BusinessNews/BusinessNews';
import BottomTabs from '../Components/BottomTabs/BottomTabs';
import './BusinessPage.scss';

import businessImg from "../Images/business-icon.png";

const BusinessPage = () => {
  return (
    <div className='business-page'>
      <Header title="Business" image={businessImg} icon="business-icon" />
      <BusinessNews />
      <BottomTabs />
    </div>
  )
}

export default BusinessPage
