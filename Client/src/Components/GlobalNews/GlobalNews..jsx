import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import News from "../../Images/news.png";

import "./GlobalNews.scss";

function GlobalNews() {
  const [animating, setAnimating] = useState(false);
  const [cardsCounter, setCardsCounter] = useState(0);
  const numOfCards = 6;
  const decisionVal = 80;
  let pullDeltaX = 0;
  let $card, $cardReject, $cardLike;

  const [bbcNews, setBBCNews] = useState([]);
  const [cnbcNews, setCNBCNews] = useState([]);

  useEffect(() => {
    fetchBBCNews();
    fetchCNBCNews();
  }, []);

  const fetchBBCNews = async () => {
    try {
      const response = await axios.get(
        "http://192.168.49.135:5000/api/news/bbc"
      );
      setBBCNews(response.data);
      //console.log(response.data)
    } catch (error) {
      console.error("Error fetching BBC news:", error);
    }
  };

  const fetchCNBCNews = async () => {
    try {
      const response = await axios.get(
        "http://192.168.49.135:5000/api/news/cnbc"
      );
      setCNBCNews(response.data);
    } catch (error) {
      console.error("Error fetching CNBC news:", error);
    }
  };

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
        if (cardsCounter === numOfCards) {
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
    } catch (error) {
      console.error("Error checking factual claims:", error);
      setFactChecking(false);
    }
  };

  const handleFactCheck = (newsArticle) => {
    checkFactualClaims(newsArticle);
  };

  const formatDateDifference = (date) => {
    const currentDate = new Date();
    const articleDate = new Date(date);
    const difference = currentDate - articleDate;
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <>
      <div className="news__card-cont">
        {cnbcNews
          .filter(
            (article) => !article.title.toLowerCase().includes("download now")
          )
          .map((article, index) => (
            <div
              key={index}
              className="news__card"
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
                <p className="news__card__we">{article.description}</p>
                <Link to={article.link} className="link-to-source">
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
                  {article.isFactual === undefined || article.isFactual === null
                    ? "Fact Check"
                    : article.isFactual
                    ? "Factual"
                    : "Not Factual"}
                </button>
                <p className="news_card_date">
                  <strong>CNBC</strong>.{formatDateDifference(article.date)}
                </p>
              </div>
              <div className="news__card__choice m--reject"></div>
              <div className="news__card__choice m--like"></div>
              <div className="news__card__drag"></div>
            </div>
          ))}
        {bbcNews
          .filter(
            (article) => !article.title.toLowerCase().includes("download now")
          )
          .map((article, index) => (
            <div
              key={index + cnbcNews.length}
              className="news__card"
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
                <p className="news__card__we">
                  {article.description.length > 120
                    ? `${article.description.substring(0, 120)}...`
                    : article.description}
                </p>

                <Link to={article.link} className="link-to-source">
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
                <p className="news_card_date">
                  <strong>BBC</strong>. {formatDateDifference(article.date)}
                </p>
              </div>
              <div className="news__card__choice m--reject"></div>
              <div className="news__card__choice m--like"></div>
              <div className="news__card__drag"></div>
            </div>
          ))}
      </div>
    </>
  );
}

export default GlobalNews;
