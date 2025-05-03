import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const contractABI = [
  "function proposals(uint256) view returns (string name, string description, uint256 amount, address recipient, uint256 votes, bool executed)",
  "function getWinningProposal() view returns (uint256)",
  "function proposalsLength() view returns (uint256)"
];
const contractAddress = "0xD03ed2100F59eD19819093eDf1bf8618cC71Dc63";

const Results = () => {
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState("");

  const fetchWinner = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const winningId = await contract.getWinningProposal();
      const proposal = await contract.proposals(winningId);

      setWinner({ id: winningId, ...proposal });
    } catch (err) {
      console.error("Error fetching winner:", err);
      setError("Unable to load winner info");
    }
  };

  useEffect(() => {
    fetchWinner();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return winner ? (
    <div className="results-section">
      <h3>🏆 Winning Applicant</h3>
      <p><strong>Name:</strong> {winner.name}</p>
      <p><strong>Description:</strong> {winner.description}</p>
      <p><strong>Requested:</strong> {ethers.formatEther(winner.amount)} ETH</p>
      <p><strong>Votes:</strong> {winner.votes.toString()}</p>
    </div>
  ) : (
    <p>Loading winner info...</p>
  );
};

export default Results;
