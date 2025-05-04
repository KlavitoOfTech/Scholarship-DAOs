import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";

function Home() {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("5");
  const [email, setEmail] = useState("");


  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem("reviews"));
    if (savedReviews) {
      setReviews(savedReviews);
    }
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("reviews", JSON.stringify(reviews));
    }
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || !email.trim()) return;

    const newReview = {
      id: Date.now(),
      text: comment,
      rating,
      email,
    };

    setReviews([newReview, ...reviews]);
    setComment("");
    setRating("5");
    setEmail("");
  };

  return (
    <div className="home-container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="gradient-heading"
      >
        Welcome to the Scholarship DAO
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Explore proposals and vote for the most deserving candidates!
      </motion.p>

      <motion.div
        className="cards"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="card">
          <h3>🌟 Apply for Scholarship</h3>
          <p>Are you a student looking for funding? Apply now and get community support!</p>
        </div>
        <div className="card">
          <h3>🗳️ Vote on Proposals</h3>
          <p>Help decide which applicants deserve scholarships by participating in votes.</p>
        </div>
        <div className="card">
          <h3>📈 Track DAO Growth</h3>
          <p>See how the DAO evolves and contributes to education worldwide.</p>
        </div>
      </motion.div>

      {/* User Reviews Section */}
      <motion.div
        className="reviews-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <h2>User Reviews</h2>
        <form className="review-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            rows="4"
            placeholder="Leave a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">⭐️⭐️⭐️⭐️⭐️</option>
            <option value="4">⭐️⭐️⭐️⭐️</option>
            <option value="3">⭐️⭐️⭐️</option>
            <option value="2">⭐️⭐️</option>
            <option value="1">⭐️</option>
          </select>
          <button type="submit">Submit Review</button>
        </form>

        <div className="reviews-list">
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map((rev) => (
            <div key={rev.id} className="review">
              <p><strong>{rev.email}</strong> says:</p>
              <p>{rev.text}</p>
              <p>Rating: {"⭐️".repeat(rev.rating)}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
