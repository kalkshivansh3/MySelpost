import React, { useState } from "react";
import "./FeedbackForm.scss";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../config";
import { Rating } from "react-simple-star-rating";
import axios from "axios";

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleRating = (rate) => {
    setRating(rate);
  };

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
      await axios.post(`${BASE_URL}/feedbacks`, {
        name,
        email,
        message,
        rating,
      });
      toast.success("Thanks for your feedback. You will get response soon!", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-form">
      <div className="feedback-card">
        <h1>Feedback Form</h1>
        <div className="feedback-inputs">
          <input
            type="text"
            placeholder="Name"
            className="name-input"
            value={name}
            onChange={handleNameChange}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="email-input"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {emailError && <p className="error-message">{emailError}</p>}
          <textarea
            placeholder="Your Feedback"
            className="message-input"
            value={message}
            onChange={handleMessageChange}
            required
          />
          <Rating onClick={handleRating} ratingValue={rating} />
        </div>
        <button
          className={
            !isFormValid || isSubmitting ? "submit-btn-disabled" : "submit-btn"
          }
          disabled={!isFormValid || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default FeedbackPage;
