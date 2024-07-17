import React, { useEffect } from "react";
import QRCode from "qrcode.react";
import Navbar from "../Components/NavBar/NavBar";
import mockup from "../Images/mockup-1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../Components/config";
import "./DesktopHomePage.scss";

const DesktopHomePage = () => {
  const pwaUrl = "http://192.168.49.135:3000/";

  useEffect(() => {
    // Listen for beforeinstallprompt event to show the install popup
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      window.deferredPrompt = event;
      document.getElementById("install-popup").style.display = "block";
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const installApp = () => {
    const installPopup = document.getElementById("install-popup");
    installPopup.style.display = "none";
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then(function (choiceResult) {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        window.deferredPrompt = null;
      });
    }
  };

  const cancelInstall = () => {
    const installPopup = document.getElementById("install-popup");
    installPopup.style.display = "none";
    window.deferredPrompt = null;
  };

  const handleQRCodeClick = () => {
    // Display install prompt if available
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
    } else {
      // If install prompt is not available, navigate to PWA URL
      window.location.href = pwaUrl;
    }
  };

  return (
    <div className="desktop-home-page">
      <Navbar />
      <div className="page">
        <div className="main-section">
          <h2 className="welcome-text">DOWNLOAD THIS APP</h2>
          <p className="third-text">
            Fact-checked updates, location-based news, and more—now at your
            fingertips. MySelpost is your go-to destination for staying
            informed, even on the busiest days. Join a community of informed
            individuals who value accuracy and innovation in every news story.
            Experience the future of news with <strong>MySelpost</strong> today.
          </p>
          <div className="qr-code-section">
            <h3 className="qr-code-text">
              <FontAwesomeIcon icon={faDownload} style={{marginRight: '5%'}} />
              Scan to Install App
            </h3>
            <div className="qr-code" onClick={handleQRCodeClick}>
              <QRCode value={pwaUrl} size={100} />
            </div>
          </div>
        </div>
        <div className="mockup">
          <img src={mockup} alt="smartphone mockup" className="mockup-img" />
        </div>
      </div>

      {/* Install Popup */}
      <div id="install-popup" style={{ display: "none" }}>
        <div id="install-popup-content">
          <button id="install-button" onClick={installApp}>
            Install
          </button>
          <button id="cancel-button" onClick={cancelInstall}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopHomePage;
