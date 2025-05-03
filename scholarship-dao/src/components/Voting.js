import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../styles/Voting.css";

const contractABI = [
  "function proposals(uint256) view returns (string name, string description, uint256 amount, address recipient, uint256 votes, bool executed)",
  "function proposalsLength() view returns (uint256)",
  "function vote(uint256)"
];

const contractAddress = "0xD03ed2100F59eD19819093eDf1bf8618cC71Dc63";

function Voting() {
  const [proposals, setProposals] = useState([]);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 

  useEffect(() => {
    const loadProposals = async () => {
      try {
        if (window.ethereum) {
          const tempProvider = new ethers.BrowserProvider(window.ethereum);
          const tempSigner = await tempProvider.getSigner();
          const userAddress = await tempSigner.getAddress();

          setAccount(userAddress);
          setProvider(tempProvider);
          setSigner(tempSigner);

          const contract = new ethers.Contract(contractAddress, contractABI, tempProvider);
          const proposalCount = await contract.proposalsLength();

          if (proposalCount === 0) {
            setProposals([]);
            setLoading(false);
            return;
          }

          let fetchedProposals = [];
          for (let i = 0; i < proposalCount; i++) {
            try {
              const proposal = await contract.proposals(i);
              fetchedProposals.push({ id: i, ...proposal });
            } catch (err) {
              console.error(`Error fetching proposal at index ${i}:`, err);
              setError("Failed to fetch proposals. Please check the contract state.");
            }
          }

          setProposals(fetchedProposals);
        } else {
          alert("Please install MetaMask");
        }
      } catch (error) {
        console.error("Error loading proposals:", error);
        setError("There was an error loading the proposals.");
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, []);

  const handleVote = async (id) => {
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.vote(id);
      await tx.wait();
      alert("Voted successfully!");

      const updatedProposals = [...proposals];
      updatedProposals[id].votes = (parseInt(updatedProposals[id].votes) + 1).toString();
      setProposals(updatedProposals);
    } catch (error) {
      console.error("Voting failed:", error);
      alert("Voting failed. Maybe you already voted?");
    }
  };

  return (
    <div className="voting-page">
      <h1>🗳️ Voting Page</h1>
      {!account ? (
        <p>Please connect your wallet!</p>
      ) : loading ? (
        <p>Loading proposals...</p>
      ) : proposals.length === 0 ? (
        <p className="no-proposals">Apply to create proposals.</p>
      ) : error ? (
        <p>Error: {error}</p> // Display error message if there's an issue
      ) : (
        <div className="proposals-grid">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="proposal-card">
              <h3>{proposal.name}</h3>
              <p><strong>Reason:</strong> {proposal.description}</p>
              <p><strong>Votes:</strong> {proposal.votes.toString()}</p>
              <button className="vote-button" onClick={() => handleVote(proposal.id)}>
                Vote
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Voting;
