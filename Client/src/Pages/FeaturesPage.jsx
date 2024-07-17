import React, { useState } from "react";
import NavBar from "../Components/NavBar/NavBar";
import mockup1 from "../Images/first-feature.jpg";
import mockup2 from "../Images/second-feature.jpg";
import mockup3 from "../Images/third-feature.jpg";
import mockup4 from "../Images/fourth-feature.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./FeaturesPage.scss";

const features = [
  {
    title: "Fact-Checked News",
    description:
      "In an era where misinformation spreads rapidly, our Fact-Checked News feature ensures that you receive accurate and trustworthy information. Every article undergoes a rigorous verification process by our team of expert fact-checkers. We cross-reference multiple reliable sources to bring you the most credible news, providing transparency and confidence in what you read. Stay informed with the truth, only on our platform.",
    image: mockup1,
    mockup: "first-mockup",
  },
  {
    title: "News Timer",
    description:
      "In today’s fast-paced world, finding time to stay informed can be challenging. Our News Timer feature allows you to read news based on your available time. Choose from quick updates in 1 minute, concise summaries in 3 minutes, or more detailed coverage in 10 minutes. Stay updated efficiently, no matter how busy your schedule is.",
    image: mockup2,
    mockup: "second-mockup",
  },
  {
    title: "Maps News",
    description:
      "Explore the world through news with our innovative Maps News feature. By clicking on any country on the map, you can access the latest news from each state within your own country and around the globe. Stay connected with local and international events, all at your fingertips. Discover what's happening anywhere in the world with just a click.",
    image: mockup3,
    mockup: "third-mockup",
  },
  {
    title: "News Snap",
    description:
      "Stay informed in a snap with our News Snap feature. Simply click the capture button to take a photo of anything, and instantly receive the latest news related to the image. Whether it's a landmark, an event, or a product, our advanced image recognition technology delivers relevant news stories right to your screen. Explore the world through your lens and stay updated effortlessly.",
    image: mockup4,
    mockup: "fourth-mockup",
  },
];

const FeaturesPage = () => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const handleNextFeature = () => {
    setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const handlePreviousFeature = () => {
    setCurrentFeatureIndex((prevIndex) =>
      prevIndex === 0 ? features.length - 1 : prevIndex - 1
    );
  };

  const { title, description, image, mockup } = features[currentFeatureIndex];

  return (
    <div className="Features-Page">
      <NavBar />
      <div className="first-feature">
        {currentFeatureIndex > 0 && (
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="left-arrow"
            onClick={handlePreviousFeature}
          />
        )}
        <div className="feature-box">
          <div className="feature-details">
            <h2 className="feature-title">{title}</h2>
            <p className="feature-description">{description}</p>
          </div>
          <div className="feature-mockup">
            <img src={image} alt="news in card form" className={mockup} />
          </div>
        </div>
        <FontAwesomeIcon
          icon={faArrowRight}
          className="right-arrow"
          onClick={handleNextFeature}
        />
      </div>
    </div>
  );
};

export default FeaturesPage;
