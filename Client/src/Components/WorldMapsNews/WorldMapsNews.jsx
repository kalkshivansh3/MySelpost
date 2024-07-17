import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./WorldMapsNews.scss";
import axios from "axios";

import location from "../../Images/location.png";

import { BASE_URL } from "../config";

const WorldMapsNews = () => {
  const mapContainer = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted && mapContainer.current) {
      const mapCenter = [20, 0];
      const map = L.map(mapContainer.current).setView(mapCenter, 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const locations = [
        { name: "US", coordinates: [39.8283, -98.5795], icon: location },
        { name: "Australia", coordinates: [-25, 133], icon: location },
        { name: "India", coordinates: [20.5937, 78.9629], icon: location },
        { name: "China", coordinates: [35.8617, 104.1954], icon: location },
        { name: "Russia", coordinates: [61.524, 105.3188], icon: location },
        { name: "Brazil", coordinates: [-14.235, -51.9253], icon: location },
        {
          name: "Argentina",
          coordinates: [-38.4161, -63.6167],
          icon: location,
        },
        { name: "Israel", coordinates: [31.0461, 34.8516], icon: location },
        {
          name: "SaudiArabia",
          coordinates: [23.8859, 45.0792],
          icon: location,
        },
        {
          name: "SouthAfrica",
          coordinates: [-30.5595, 22.9375],
          icon: location,
        },
        { name: "Turkey", coordinates: [38.9637, 35.2433], icon: location },
        { name: "Pakistan", coordinates: [30.3753, 69.3451], icon: location },
        { name: "Nepal", coordinates: [28.3949, 84.124], icon: location },
        { name: "Bangladesh", coordinates: [23.685, 90.3563], icon: location },
        { name: "SriLanka", coordinates: [7.8731, 80.7718], icon: location },
        {
          name: "NewZealand",
          coordinates: [-40.9006, 174.886],
          icon: location,
        },
        { name: "Canada", coordinates: [56.1304, -106.3468], icon: location },
        {
          name: "UK",
          coordinates: [55.3781, -3.436],
          icon: location,
        },
        { name: "Denmark", coordinates: [56.2639, 9.5018], icon: location },
        { name: "Nigeria", coordinates: [9.082, 8.6753], icon: location },
        { name: "Greenland", coordinates: [71.7069, -42.6043], icon: location },
        { name: "Germany", coordinates: [51.1657, 10.4515], icon: location },
        { name: "France", coordinates: [46.6034, 1.8883], icon: location },
        { name: "Japan", coordinates: [36.2048, 138.2529], icon: location },
        { name: "Myanmar", coordinates: [21.9162, 95.956], icon: location },
        { name: "Indonesia", coordinates: [-0.7893, 113.9213], icon: location },
        { name: "Mexico", coordinates: [19.4326, -99.1332], icon: location },
      ];

      const cityMarkers = locations.map((location) => {
        const icon = L.icon({
          iconUrl: location.icon,
          iconSize: [32, 32],
        });

        const marker = L.marker(location.coordinates, { icon }).addTo(map);
        marker.bindPopup(
          `<div class="loading-news"><b>Loading News...</b></div>`,
          { className: "custom-popup-world" }
        );

        marker.on("click", async () => {
          try {
            const response = await axios.get(
              `${BASE_URL}/news/${location.name.toLowerCase()}`
            );
            const newsArticles = response.data;
            const headlines = newsArticles.map((article) => article.title);
            const popup = marker.getPopup();
            showHeadlines(popup, location.name, headlines.slice(0, 20));
          } catch (error) {
            console.error("Error fetching news:", error);
          }
        });
        return { name: location.name, marker, headlines: [] };
      });

      setCities(cityMarkers);

      return () => {
        map.remove();
      };
    }
  }, [isMounted, mapContainer]);

  useEffect(() => {
    cities.forEach((city) => {
      city.marker.on("click", async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/news/${city.name.toLowerCase()}`
          );
          const newsArticles = response.data;
          city.headlines = newsArticles.map((article) => article.title);
          showHeadlines(city);
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      });
    });
  }, [cities]);

  const showHeadlines = (popup, cityName, headlines) => {
    let index = 0;
    popup.setContent(
      `<div><b class="city">${cityName}</b><br><span class="world-headline">${headlines[index]}</span></div>`
    );
    setInterval(() => {
      index = (index + 1) % headlines.length;
      popup.setContent(
        `<div><b class="city">${cityName}</b><br><span class="world-headline">${headlines[index]}</span></div>`
      );
    }, 5000);
  };

  return (
    <div style={{ position: "relative", zIndex: "1" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default WorldMapsNews;
