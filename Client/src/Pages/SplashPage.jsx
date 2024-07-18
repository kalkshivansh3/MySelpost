import React, { useEffect } from "react";
import Logo from "../Images/logo.png";
import "./SplashPage.scss";

const SplashPage = ({ setLoading }) => {
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [setLoading]);

  return (
    <div className="splash">
      <img src={Logo} alt="platform logo" width={200} height={200} />
    </div>
  );
};

export default SplashPage;
