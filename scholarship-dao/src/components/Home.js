import React from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";

function Home() {
  console.log("Rendering Home Component");

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
    </div>
  );
}

export default Home;

