import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./Pages/HomePage";
import DesktopHomePage from "./Pages/DesktopHomePage";
import SplashPage from "./Pages/SplashPage";
import MapsPage from "./Pages/MapsPage";
import NewsTimerPage from "./Pages/NewsTimerPage";
import WorldNewsPage from "./Pages/WorldNewsPage";
import CameraNewsPage from "./Pages/CameraNewsPage";
import FirstTrendingPage from "./Pages/FirstTrendingPage";
import SecondTrendingPage from "./Pages/SecondTrendingPage";
import TechnologyPage from "./Pages/TechnologyPage";
import BusinessPage from "./Pages/BusinessPage";
import SportsPage from "./Pages/SportsPage";
import HealthPage from "./Pages/HealthPage";
import SciencePage from "./Pages/SciencePage";
import EntertainmentPage from "./Pages/EntertainmentPage";
import FashionPage from "./Pages/FashionPage";
import EducationPage from "./Pages/EducationPage";
import FeedbackPage from "./Pages/FeedbackPage";
import ContactUsPage from "./Pages/ContactUsPage";
import FeaturesPage from "./Pages/FeaturesPage";
import NotFoundPage from "./Pages/NotFoundPage";
import Practice from "./Components/Practice";

const SplashScreen = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleLoading = useCallback(() => {
    setLoading(false);
  }, []);

  // Function to check if it's desktop
  const isDesktop = !isMobile;

  return (
    <div>
      {loading ? (
        <SplashPage setLoading={handleLoading} />
      ) : (
        <Router>
          <div>
            <Routes>
              {/* Only allow these routes on desktop */}
              {isDesktop ? (
                <>
                  <Route path="/" element={<DesktopHomePage />} />
                  <Route path="/contact-us" element={<ContactUsPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/world-news" element={<WorldNewsPage />} />
                  <Route path="/camera-news" element={<CameraNewsPage />} />
                  <Route path="/news-timer" element={<NewsTimerPage />} />
                  <Route path="/maps-news" element={<MapsPage />} />
                  <Route
                    path="/first-trending"
                    element={<FirstTrendingPage />}
                  />
                  <Route
                    path="/second-trending"
                    element={<SecondTrendingPage />}
                  />
                  <Route path="/technology" element={<TechnologyPage />} />
                  <Route path="/business" element={<BusinessPage />} />
                  <Route path="/sports" element={<SportsPage />} />
                  <Route path="/health" element={<HealthPage />} />
                  <Route path="/science" element={<SciencePage />} />
                  <Route
                    path="/entertainment"
                    element={<EntertainmentPage />}
                  />
                  <Route path="/fashion" element={<FashionPage />} />
                  <Route path="/education" element={<EducationPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/practice" element={<Practice />} />
                  <Route path="*" element={<NotFoundPage />} />
                </>
              )}
            </Routes>
          </div>
        </Router>
      )}
    </div>
  );
};

const App = () => {
  return <SplashScreen />;
};

export default App;
