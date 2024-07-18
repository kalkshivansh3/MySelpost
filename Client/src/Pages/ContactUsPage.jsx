import React, { useState } from "react";
import NavBar from "../Components/NavBar/NavBar";
import toast, { Toaster } from "react-hot-toast";
import contact from "../Images/contact.png";
import { BASE_URL } from "../Components/config";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import "./ContactUsPage.scss";

const ContactUsPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
    checkFormValidity();
  };

  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setEmailError("");
    checkFormValidity();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
    }
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    checkFormValidity();
  };

  const checkFormValidity = () => {
    if (name.trim() !== "" && email.trim() !== "" && message.trim() !== "") {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await axios.post(`${BASE_URL}/contact-us`, {
        name,
        email,
        message,
      });
      toast.success("Form is submitted. You will get response soon!", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to submit the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="contact-box">
        <div className="contact-section">
          <h2 className="contact-box-first-head">Get In Touch</h2>
          <h4 className="contact-box-second-head">
            We are here with you! How can we help?
          </h4>
          <div className="form">
            <input
              type="text"
              className="contact-form-name"
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
              required
            />
            <input
              type="text"
              className="contact-form-email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <textarea
              cols="30"
              rows="10"
              className="contact-form-message"
              placeholder="Go ahead, we are listening..."
              value={message}
              onChange={handleMessageChange}
              required
            ></textarea>
          </div>
          <button
            className={
              !isFormValid || isSubmitting
                ? "submit-btn-disabled"
                : "submit-btn"
            }
            disabled={!isFormValid || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        <div className="illustration-section">
          <img
            src={contact}
            alt="cartoonish girl standing facing form"
            className="contact-us-illustration"
          />
          <div className="contact-info">
            <div className="illustration-section-location">
              <FontAwesomeIcon icon={faLocationDot} className="location-dot" />
              <strong className="location-txt">New Delhi, India</strong>
            </div>
            <div className="illustration-section-email1">
              <FontAwesomeIcon icon={faEnvelope} className="first-inbox" />
              <strong className="inbox-txt1">myselpost03@gmail.com</strong>
            </div>
            <div className="illustration-section-email2">
              <FontAwesomeIcon icon={faEnvelope} className="second-inbox" />
              <strong className="inbox-txt2">anujers.social@gmail.com</strong>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default ContactUsPage;
