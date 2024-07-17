import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./NationalMapsNews.scss";
import axios from "axios";

import location from "../../Images/location.png";

import { BASE_URL } from "../config";

const NationalMapsNews = () => {
  const mapContainer = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [cities, setCities] = useState([]);
  const userCountry = localStorage.getItem("country");

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted && mapContainer.current) {
      let map;
      let mapCenter;
      let locations;

      if (userCountry === "IN") {
        mapCenter = [20.5937, 78.9629];
        locations = [
          { name: "Delhi", coordinates: [28.7041, 77.1025], icon: location },
          { name: "Mumbai", coordinates: [19.076, 72.8777], icon: location },
          {
            name: "Bangalore",
            coordinates: [12.9716, 77.5946],
            icon: location,
          },
          { name: "Chennai", coordinates: [13.0827, 80.2707], icon: location },
          { name: "Hyderabad", coordinates: [17.385, 78.4867], icon: location },
          { name: "Kochi", coordinates: [9.9312, 76.2673], icon: location },
          { name: "Kolkata", coordinates: [22.5726, 88.3639], icon: location },
          { name: "Madurai", coordinates: [9.9252, 78.1198], icon: location },
          {
            name: "Kozhikode",
            coordinates: [11.2588, 75.7804],
            icon: location,
          },
          { name: "Mangaluru", coordinates: [12.9141, 74.856], icon: location },
          {
            name: "Puducherry",
            coordinates: [11.9139, 79.8145],
            icon: location,
          },
          {
            name: "Thiruvananthapuram",
            coordinates: [8.5241, 76.9366],
            icon: location,
          },
          {
            name: "Tiruchirapalli",
            coordinates: [10.7905, 78.7047],
            icon: location,
          },
          {
            name: "Vijayawada",
            coordinates: [16.5062, 80.648],
            icon: location,
          },
          {
            name: "HimachalPradesh",
            coordinates: [31.1048, 77.1734],
            icon: location,
          },
          { name: "Haryana", coordinates: [29.0588, 76.0856], icon: location },
          {
            name: "JammuKashmir",
            coordinates: [33.7782, 76.5762],
            icon: location,
          },
          { name: "Punjab", coordinates: [31.1471, 75.3412], icon: location },
          { name: "Jaipur", coordinates: [26.9124, 75.7873], icon: location },
          { name: "Surat", coordinates: [21.1702, 72.8311], icon: location },
          { name: "Varanasi", coordinates: [25.3176, 82.9739], icon: location },
          {
            name: "Ahmedabad",
            coordinates: [23.0225, 72.5714],
            icon: location,
          },
          { name: "Hyderabad", coordinates: [17.385, 78.4867], icon: location },
          { name: "Guwahati", coordinates: [26.1445, 91.7362], icon: location },
          { name: "Goa", coordinates: [15.2993, 74.124], icon: location },
          { name: "Patna", coordinates: [25.5941, 85.1376], icon: location },
          { name: "Ranchi", coordinates: [23.3441, 85.3096], icon: location },
          { name: "Kanpur", coordinates: [26.4499, 80.3319], icon: location },
          { name: "Hubli", coordinates: [15.3647, 75.1239], icon: location },
          { name: "Bhopal", coordinates: [23.2599, 77.4126], icon: location },
        ];
      } else if (userCountry === "US") {
        mapCenter = [37.0902, -95.7129];
        locations = [
          { name: "NewYork", coordinates: [40.7128, -74.006], icon: location },
          { name: "Texas", coordinates: [31.9686, -99.9018], icon: location },
          {
            name: "Mississippi",
            coordinates: [32.3547, -89.3985],
            icon: location,
          },
          {
            name: "Florida",
            coordinates: [27.994402, -81.760254],
            icon: location,
          },
          {
            name: "Montana",
            coordinates: [46.8797, -110.3626],
            icon: location,
          },
          {
            name: "Washington",
            coordinates: [47.7511, -120.7401],
            icon: location,
          },
          {
            name: "LasVegas",
            coordinates: [36.1699, -115.1398],
            icon: location,
          },
          {
            name: "California",
            coordinates: [36.7783, -119.4179],
            icon: location,
          },
          {
            name: "Nebraska",
            coordinates: [40.8136, -96.7026],
            icon: location,
          },
          {
            name: "NorthDakota",
            coordinates: [47.5515, -101.002],
            icon: location,
          },
          {
            name: "Denver",
            coordinates: [39.7392, -104.9903],
            icon: location,
          },
          {
            name: "SouthCarolina",
            coordinates: [33.8361, -81.1637],
            icon: location,
          },
          { name: "Indiana", coordinates: [40.2732, -86.1263], icon: location },
        ];
      } else if (userCountry === "ID") {
        mapCenter = [-0.7893, 113.9213];
        locations = [
          { name: "Jakarta", coordinates: [-6.2088, 106.8456], icon: location },
          { name: "Bandung", coordinates: [-6.9175, 107.6191], icon: location },
          {
            name: "Surabaya",
            coordinates: [-7.2575, 112.7521],
            icon: location,
          },
          { name: "Bali", coordinates: [-8.3405, 115.092], icon: location },
          { name: "Sumatra", coordinates: [-0.5897, 101.3431], icon: location },
        ];
      } else if (userCountry === "CU") {
        mapCenter = [21.521757, -77.781167];
        locations = [
          { name: "Havana", coordinates: [23.1136, -82.3666], icon: location },
          {
            name: "Santiago",
            coordinates: [20.0069, -75.8478],
            icon: location,
          },
          {
            name: "PinarDelRio",
            coordinates: [22.4245, -83.6976],
            icon: location,
          },
          {
            name: "Matanzas",
            coordinates: [23.0415, -81.5775],
            icon: location,
          },
        ];
      } else if (userCountry === "UK") {
        mapCenter = [55.3781, -3.436];
        locations = [
          { name: "London", coordinates: [51.5074, -0.1278], icon: location },
          {
            name: "Manchester",
            coordinates: [53.4808, -2.2426],
            icon: location,
          },
          {
            name: "Birmingham",
            coordinates: [52.4862, -1.8904],
            icon: location,
          },
          { name: "Glasgow", coordinates: [55.8642, -4.2518], icon: location },
          { name: "Wales", coordinates: [52.1307, -3.7837], icon: location },
          {
            name: "NorthernIreland",
            coordinates: [54.7877, -6.4923],
            icon: location,
          },
          { name: "Scotland", coordinates: [56.4907, -4.2026], icon: location },
        ];
      } else {
        mapCenter = [20, 0];
        locations = [];
      }

      map = L.map(mapContainer.current).setView(mapCenter, 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const cityMarkers = locations.map((location) => {
        const icon = L.icon({
          iconUrl: location.icon,
          iconSize: [32, 32],
        });

        const marker = L.marker(location.coordinates, { icon }).addTo(map);
        marker.bindPopup(
          `<div class="loading-news"><b>Loading News...</b></div>`,
          { className: "custom-popup" }
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
  }, [isMounted, mapContainer, userCountry]);

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
      `<div><b class="city">${cityName}</b><br><span class="national-headline">${headlines[index]}</span></div>`
    );
    setInterval(() => {
      index = (index + 1) % headlines.length;
      popup.setContent(
        `<div><b class="city">${cityName}</b><br><span class="national-headline">${headlines[index]}</span></div>`
      );
    }, 5000);
  };

  return (
    <div style={{ position: "relative", zIndex: "1" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default NationalMapsNews;
