import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import axios from "axios";
import AlertPopup from "../AlertPopup/AlertPopup";
import News from "../../Images/news.png";
import { BASE_URL } from "../config";
import { LOCATION_URL } from "../location";
import "./LocalNews.scss";

function LocalNews() {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [animating, setAnimating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState(null);
  const [combinedLocalNews, setCombinedLocalNews] = useState([]);
  const [cardsCounter, setCardsCounter] = useState(0);
  const [visibleCards, setVisibleCards] = useState(40);
  const [subscription, setSubscription] = useState(null);
  const numOfCardsPerLoad = 40;
  const decisionVal = 80;

  let pullDeltaX = 0;
  let $card, $cardReject, $cardLike;

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            "/service-worker.js"
          );

          const vapidPublicKey =
            "BFYpZ9Lk5HdtTY5gx2InF-FXWMFb0sbaQgQa489op10YK9mBu4hgM-JQGh6K6Pwq8NwGn3tHMbNukgx3IWD51PY";
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          const newSubscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });
          setSubscription(newSubscription);
          await axios.post(`${BASE_URL}/subscribe`, newSubscription);
        } catch (error) {
          console.error("Error subscribing to push notifications:", error);
        }
      };

      registerServiceWorker();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (combinedLocalNews.length > 0) {
        const headlines = combinedLocalNews
          .slice(0, 3)
          .map((article) => article.title);
        headlines.forEach((headline) => {
          sendNotification("MySelpost", headline);
        });
      }
    }, 3600000); // 1 hour in milliseconds

    return () => clearInterval(interval);
  }, [combinedLocalNews]);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("isFirstVisit");

    const fetchCountry = async () => {
      try {
        const response = await axios.get(`${LOCATION_URL}`);
        const { country } = response.data;
        localStorage.setItem("country", country);
        setCountry(country);
        localStorage.setItem("isFirstVisit", false);
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };

    if (!isFirstVisit) {
      fetchCountry();
    } else {
      const storedCountry = localStorage.getItem("country");
      if (storedCountry) {
        setCountry(storedCountry);
      }
    }
  }, []);

  const sendNotification = async (title, body) => {
    try {
      await axios.post(`${BASE_URL}/send-notification`, { title, body });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      let responseArray;
      if (country === "IN") {
        responseArray = await Promise.all([
          axios.get(`${BASE_URL}/news/ndtvnews`),
          axios.get(`${BASE_URL}/news/indianews`),
          axios.get(`${BASE_URL}/news/zeenews`),
        ]);
      } else if (country === "US") {
        responseArray = await Promise.all([
          axios.get(`${BASE_URL}/news/cbsnews`),
          axios.get(`${BASE_URL}/news/huffpost`),
          axios.get(`${BASE_URL}/news/cnnnews`),
          axios.get(`${BASE_URL}/news/lanews`),
        ]);
      } else if (country === "UK") {
        responseArray = await Promise.all([
          axios.get(`${BASE_URL}/news/bbc`),
          axios.get(`${BASE_URL}/news/guardian`),
          axios.get(`${BASE_URL}/news/independent`),
          axios.get(`${BASE_URL}/news/telegraph`),
        ]);
      } else if (country === "CU") {
        responseArray = await Promise.all([
          axios.get(`${BASE_URL}/news/granma`),
        ]);
      } else {
        setCombinedLocalNews([]);
        setIsLoading(false);
        return;
      }

      const combinedNews = responseArray.flatMap(({ data }, index) => {
        let countryName;
        if (country === "IN") {
          countryName = "India";
        } else if (country === "US") {
          countryName = "US";
        } else if (country === "UK") {
          countryName = "UK";
        } else if (country === "CU") {
          countryName = "Cuba";
        } else {
          countryName = "Unknown";
        }

        return combineNews(data, countryName);
      });

      setCombinedLocalNews(combinedNews);
      if (combinedNews.length > 0) {
        const headlines = combinedNews
          .slice(0, 3)
          .map((article) => article.title); // Assuming the headline is in the title field
        headlines.forEach((headline, index) => {
          sendNotification(`MySelpost`, headline);
        });
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  }, [country]);

  useEffect(() => {
    if (!["IN", "UK", "US", "CU"].includes(country)) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      fetchData();
    }
  }, [country, fetchData]);

  function pullChange() {
    if (!$card || !$cardReject || !$cardLike) return;

    setAnimating(true);
    const deg = pullDeltaX / 10;
    $card.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

    const opacity = pullDeltaX / 100;
    $cardReject.style.opacity = opacity >= 0 ? 0 : Math.abs(opacity);
    $cardLike.style.opacity = opacity <= 0 ? 0 : opacity;
  }

  function release() {
    const direction = pullDeltaX >= 0 ? "to-right" : "to-left";
    $card.classList.add(direction);

    if (Math.abs(pullDeltaX) >= decisionVal) {
      $card.classList.add("inactive");

      setTimeout(() => {
        $card.classList.add("below");
        $card.classList.remove("inactive", "to-left", "to-right");
        setCardsCounter(cardsCounter + 1);
        if (cardsCounter === numOfCardsPerLoad) {
          setCardsCounter(0);
          document
            .querySelectorAll(".demo__card")
            .forEach((card) => card.classList.remove("below"));
        }
      }, 300);
    } else {
      $card.classList.add("reset");
    }

    setTimeout(() => {
      $card.removeAttribute("style");
      $card.classList.remove("reset");
      $card
        .querySelectorAll(".demo__card__choice")
        .forEach((choice) => choice.removeAttribute("style"));

      pullDeltaX = 0;
      setAnimating(false);
    }, 300);
  }

  function handleMouseDownOrTouchStart(e) {
    if (animating) return;

    $card = e.currentTarget;
    $cardReject = $card.querySelector(".demo__card__choice.m--reject");
    $cardLike = $card.querySelector(".demo__card__choice.m--like");
    const startX = e.pageX || e.touches[0].pageX;

    function handleMouseMoveOrTouchMove(e) {
      const x = e.pageX || e.touches[0].pageX;
      pullDeltaX = x - startX;
      if (!pullDeltaX) return;
      pullChange();
    }

    function handleMouseUpOrTouchEnd() {
      document.removeEventListener("mousemove", handleMouseMoveOrTouchMove);
      document.removeEventListener("mouseup", handleMouseUpOrTouchEnd);
      document.removeEventListener("touchmove", handleMouseMoveOrTouchMove);
      document.removeEventListener("touchend", handleMouseUpOrTouchEnd);
      if (!pullDeltaX) return;
      release();
    }

    document.addEventListener("mousemove", handleMouseMoveOrTouchMove);
    document.addEventListener("mouseup", handleMouseUpOrTouchEnd);
    document.addEventListener("touchmove", handleMouseMoveOrTouchMove);
    document.addEventListener("touchend", handleMouseUpOrTouchEnd);
  }

  const [factChecking, setFactChecking] = useState(false);

  const checkFactualClaims = async (article) => {
    setFactChecking(true);

    try {
      const api_key = "307425e154ff424b9a6fd2e9513ec503";
      const response = await axios.get(
        `https://idir.uta.edu/claimbuster/api/v2/score/text/${article.description}`,
        {
          headers: {
            "x-api-key": api_key,
          },
        }
      );

      const isFactual = response.data.results[0].score > 0.1;

      article.isFactual = isFactual;

      setFactChecking(false);
      //console.log(response.data)
    } catch (error) {
      console.error("Error checking factual claims:", error);
      setFactChecking(false);
    }
  };

  const handleFactCheck = (newsArticle) => {
    checkFactualClaims(newsArticle);
  };

  const formatDateDifference = useCallback((date) => {
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2591260 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    const currentDate = new Date();
    const difference = Math.floor((currentDate - new Date(date)) / 1000);

    for (const { label, seconds } of intervals) {
      const value = Math.floor(difference / seconds);
      if (value >= 1) {
        return `${value} ${label}${value !== 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  }, []);

  const combineNews = useCallback(
    (newsArray, source) => newsArray.map((news) => ({ ...news, source })),
    []
  );

  const loadMoreCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + numOfCardsPerLoad);
  };

  const renderNewsArticles = useCallback(
    (articles) => {
      return sortArticlesByDate(articles)
        .slice(cardsCounter, cardsCounter + visibleCards)
        .map((article, index) => (
          <div
            key={index}
            className={`news__card ${index < cardsCounter ? "below" : ""}`}
            onMouseDown={handleMouseDownOrTouchStart}
            onTouchStart={handleMouseDownOrTouchStart}
          >
            <div
              className={`news__card__top ${
                index % 2 === 0 ? "brown" : "lime"
              }`}
            >
              <div className="news__card__img">
                <img
                  src={article.image ? article.image : News}
                  alt="Article"
                  className="article-img"
                />
              </div>
            </div>
            <div className="news__card__btm">
              <h3 className="news__card__we">{article.title}</h3>
              <p
                className={
                  article.description.length > 120
                    ? "news__card__we__big"
                    : "news__card__we"
                }
              >
                {article.description.length > 170
                  ? `${article.description.substring(0, 170)}...`
                  : article.description}
              </p>
              <div className="link-fact-date-cont">
                <div className="link-fact-cont">
                  <Link
                    to={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-to-source"
                  >
                    Read More
                  </Link>
                  <button
                    onClick={() => handleFactCheck(article)}
                    className={`fact-btn ${
                      article.isFactual === undefined ||
                      article.isFactual === null
                        ? ""
                        : article.isFactual
                        ? "fact-btn-green"
                        : "fact-btn-red"
                    }`}
                  >
                    {factChecking
                      ? "Checking..."
                      : article.isFactual === undefined ||
                        article.isFactual === null
                      ? "Fact Check"
                      : article.isFactual
                      ? "Factual"
                      : "Not Factual"}
                  </button>
                  <FontAwesomeIcon
                    icon={
                      speakingArticle === article.description
                        ? faVolumeHigh
                        : faVolumeXmark
                    }
                    onClick={() => toggleSpeak(article.description)}
                    className="speaker"
                  />
                </div>
                <p className="news_card_date">
                  <strong>{article.source}</strong>.{" "}
                  {formatDateDifference(article.date)}
                </p>
              </div>
            </div>
            <div className="news__card__choice m--reject"></div>
            <div className="news__card__choice m--like"></div>
            <div className="news__card__drag"></div>
          </div>
        ));
    },
    [
      handleMouseDownOrTouchStart,
      handleFactCheck,
      formatDateDifference,
      visibleCards,
    ]
  );

  const sortArticlesByDate = useCallback((articles) => {
    return articles.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }, []);

  const [speaking, setSpeaking] = useState(false);
  const [speakingArticle, setSpeakingArticle] = useState(null);

  const toggleSpeak = (description) => {
    if (speaking) {
      stopSpeaking();
    } else {
      speakArticleDescription(description);
      setSpeakingArticle(description);
    }
  };

  const speakArticleDescription = (description) => {
    const utterance = new SpeechSynthesisUtterance(description);
    utterance.addEventListener("end", () => {
      setSpeaking(false);
      setSpeakingArticle(null);
    });
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setSpeakingArticle(null);
  };

  return (
    <>
      <div className="news__card-cont">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {renderNewsArticles(combinedLocalNews)}
            {combinedLocalNews.length > visibleCards && (
              <button className="load-more-btn" onClick={loadMoreCards}>
                Load More
              </button>
            )}
          </>
        )}
      </div>
      {showAlert && (
        <AlertPopup
          message="This feature will come soon for your country!"
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
}

export default LocalNews;
