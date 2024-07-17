import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import News from "../../Images/news.png";

import { BASE_URL } from "../config";
import { LOCATION_URL } from "../location";

import "../LocalNews/LocalNews";

const EntertainmentNews = () => {
  const [animating, setAnimating] = useState(false);
  const [factChecking, setFactChecking] = useState(false);
  const [country, setCountry] = useState(null);

  const [cardsCounter, setCardsCounter] = useState(0);
  const [visibleCards, setVisibleCards] = useState(20);

  const numOfCardsPerLoad = 20;
  const decisionVal = 80;

  let pullDeltaX = 0;
  let $card, $cardReject, $cardLike;

  //! Fetch user country
  useEffect(() => {
    const isFirstVisit = localStorage.getItem("isFirstVisit");

    if (!isFirstVisit) {
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

      fetchCountry();
    } else {
      const storedCountry = localStorage.getItem("country");
      if (storedCountry) {
        setCountry(storedCountry);
      }
    }
  }, []);

  const [combinedEntertainmentNews, setCombinedEntertainmentNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      let responseArray;
      if (country) {
        responseArray = await Promise.all([
          axios.get(`${BASE_URL}/news/etonline`),
          axios.get(`${BASE_URL}/news/billboard`),
          axios.get(`${BASE_URL}/news/hollywoodreporter`),
          axios.get(`${BASE_URL}/news/deadline`),
          axios.get(`${BASE_URL}/news/variety`),
        ]);
      } else {
        setCombinedEntertainmentNews([]);
        setIsLoading(false);
        return;
      }

      

      const combinedNews = responseArray.flatMap(({ data }, index) => {
        let countryName;
        if (country) {
          countryName = "Fun";
        } else {
          countryName = "Fun";
        }

        return combineNews(data, countryName)
      });

      setCombinedEntertainmentNews(combinedNews);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  }, [country]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  //! Format date in readable format
  const formatDateDifference = (date) => {
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
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
  };

  const combineNews = (newsArray, source) =>
    newsArray.map((news) => ({ ...news, source }));

  //! Render news articles
  const renderNewsArticles = useCallback(
    (articles) => {
      // Check if articles is defined and is an array
      if (!Array.isArray(articles)) {
        console.error("Articles data is not valid:", articles);
        return null;
      }

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

  //! Sort articles by date
  const sortArticlesByDate = useCallback((articles) => {
    return articles.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
  }, []);

  const loadMoreCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + numOfCardsPerLoad);
  };

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
            {renderNewsArticles(combinedEntertainmentNews)}
            {combinedEntertainmentNews.length > visibleCards && (
              <button className="load-more-btn" onClick={loadMoreCards}>
                Load More
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default EntertainmentNews;
