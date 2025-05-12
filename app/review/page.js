"use client";
import { useState } from "react";
import "./review.css"; // ⬅️ import the CSS

export default function ReviewPage() {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Review submitted:", { name, review });
    setSubmitted(true);
    setName("");
    setReview("");
  };

  return (
    <div className="review-container">
      <div className="review-card">
        <h1 className="review-title">Leave a Review</h1>

        {submitted ? (
          <div className="success-message">✅ Thank you for your review!</div>
        ) : (
          <form onSubmit={handleSubmit} className="review-form">
            <label className="form-label">
              Your Name (optional)
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </label>

            <label className="form-label">
              Your Review <span className="required">*</span>
              <textarea
                required
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="form-textarea"
              />
            </label>

            <button type="submit" className="submit-button">
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
