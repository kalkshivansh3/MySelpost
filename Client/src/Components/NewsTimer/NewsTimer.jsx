import React, { useState, useEffect, useRef } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import DonePopup from "../DonePopup/DonePopup";
import { BASE_URL } from "../config";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import axios from "axios";
import "./NewsTimer.scss";

const NewsTimer = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedCustomOption, setSelectedCustomOption] = useState("World");
  const [scrollIndex, setScrollIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const sliderRef = useRef(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setScrollIndex(0);
    setButtonDisabled(true);
    switch (option) {
      case 1:
        setCountdown(60);
        break;
      case 3:
        setCountdown(180);
        break;
      case 10:
        setCountdown(600);
        break;
      default:
        setCountdown(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const option = selectedCustomOption || "world";
        let newsSources = [];
        if (selectedCustomOption.toUpperCase() === "INDIA") {
          newsSources = ["indianews", "ndtvnews", "zeenews"];
        } else if (option.toUpperCase() === "AMERICA") {
          newsSources = ["huffpost", "cbsnews", "cnnnews"];
        } else if (option.toUpperCase() === "UK") {
          newsSources = ["bbc"];
        } else if (option.toUpperCase() === "CUBA") {
          newsSources = ["havana", "santiago", "pinardelrio", "matanzas"];
        } else if (option.toUpperCase() === "INDONESIA") {
          newsSources = ["jakarta", "bandung", "surabaya", "bali"];
        } else if (option.toUpperCase() === "BRAZIL") {
          newsSources = [
            "brazilnews",
            "brasilwire",
            "braziljournal",
            "estadao",
          ];
        } else {
          newsSources = ["thehindu"];
        }

        const responses = await Promise.all(
          newsSources.map((source, index) => {
            return axios.get(`${BASE_URL}/news/${source}`).then((response) => {
              return response;
            });
          })
        );
        const combinedData = responses.reduce((acc, response) => {
          return [...acc, ...response.data];
        }, []);

        setData(combinedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCustomOption]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prevIndex) =>
        prevIndex === Math.min((data?.length || 0) - 1, getCardLimit())
          ? 0
          : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [data, selectedOption]);

  const getCardLimit = () => {
    switch (selectedOption) {
      case 1:
        return 11;
      case 3:
        return 35;
      case 10:
        return 98;
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft =
        scrollIndex * sliderRef.current.offsetWidth;
    }
  }, [scrollIndex]);

  useEffect(() => {
    if (countdown > 0) { 
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(timer);
            setShowConfetti(true);
            setShowAlert(true);
            setButtonDisabled(false);
            setSelectedOption(null);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]); 
  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffYears > 0)
      return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
    if (diffMonths > 0)
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMinutes > 0)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="news-timer">
     {loading && <LoadingSpinner />}
      {showConfetti && (
        <ConfettiExplosion
          force={0.8}
          duration={3000}
          particleCount={250}
          width={1600}
        />
      )}
      <div className="card-slider" ref={sliderRef}>
        {data &&
          data.slice(0, getCardLimit() + 1).map((item, index) => (
            <div
              key={index}
              className={`card ${index === scrollIndex ? "active" : ""}`}
            >
              <main className="l-card">
                <section className="l-card__text">
                  <p>{item.title}</p>
                </section>
                <section className="l-card__user">
                  <div className="l-card__userImage">
                    <img
                      src={item.image}
                      className="news-source-img"
                      alt="image related to article"
                    />
                  </div>
                  <div className="l-card__userInfo">
                    <div className="share-and-selectbox-cont">
                      <div className="select">
                        <select
                          value={selectedCustomOption}
                          onChange={(e) =>
                            setSelectedCustomOption(e.target.value)
                          }
                        >
                          <option value="world">World</option>
                          <option value="india">India</option>
                          <option value="america">America</option>
                          <option value="uk">UK</option>
                          <option value="cuba">Cuba</option>
                          <option value="indonesia">Indonesia</option>
                          <option value="brazil">Brazil</option>
                        </select>
                      </div>
                      <div className="share-buttons">
                        <FacebookShareButton
                          url={"https://www.myselpost.com"}
                          quote={
                            "Your news, your way. Swipe, read, discover with MySelpost!"
                          }
                          hashtag="#myselpost"
                        >
                          <FacebookIcon size={18} round />
                        </FacebookShareButton>
                        <WhatsappShareButton
                          url={"https://www.myselpost.com"}
                          quote={
                            "Your news, your way. Swipe, read, discover with MySelpost!"
                          }
                          hashtag="#myselpost"
                        >
                          <WhatsappIcon
                            size={18}
                            style={{ marginLeft: "18%" }}
                            round
                          />
                        </WhatsappShareButton>
                        <TwitterShareButton
                          url={"https://www.myselpost.com"}
                          quote={
                            "Your news, your way. Swipe, read, discover with MySelpost!"
                          }
                          hashtag="#myselpost"
                        >
                          <TwitterIcon
                            size={18}
                            style={{ marginLeft: "29%" }}
                            round
                          />
                        </TwitterShareButton>
                      </div>
                    </div>
                    <span className="timer-card-date">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </section>
              </main>
            </div>
          ))}
      </div>
      <div className="timer-buttons">
        <div className="national-timer-cont">
          <button className="read-in-mins">Read News In</button>
          <div className="selection-container">
            <div className="options-container">
              {[1, 3, 10].map((option) => (
                <button
                  key={option}
                  className={`option ${
                    selectedOption === option ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect(option)}
                  disabled={buttonDisabled}
                >
                  {selectedOption === option
                    ? `${formatTime(countdown)}`
                    : `${option} min`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <DonePopup
          message="You have updated yourself with all latest world news!"
          onClose={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default NewsTimer;
