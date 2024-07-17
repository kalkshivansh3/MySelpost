import React from 'react';
import FeedbackHeader from "../Components/FeedbackHeader/FeedbackHeader";
import BottomTabs from "../Components/BottomTabs/BottomTabs";
import FeedbackForm from "../Components/FeedbackForm/FeedbackForm";
import './FeedbackPage.scss';

import feedbackImg from "../Images/feedback.png";

const FeedbackPage = () => {
  return (
   <div className="feedback-page">
     <FeedbackHeader title="Feedback" image={feedbackImg} icon="feedback-icon" />
      <FeedbackForm />
      <BottomTabs />
   </div>
  )
}

export default FeedbackPage
