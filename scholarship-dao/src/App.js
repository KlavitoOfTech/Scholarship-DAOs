import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Make sure to use BrowserRouter
import { ethers } from "ethers";
import Home from "./components/Home";
import Apply from "./components/Apply";
import Voting from "./components/Voting";
import "./styles/App.css";

// Contract details
const contractABI = [
  "function proposals(uint256) view returns (string name, string description, uint256 amount, address recipient, uint256 votes, bool executed)",
  "function voters(address) view returns (bool)",
  "function admin() view returns (address)",
  "function registerVoter(address)",
  "function createProposal(string,string,uint256,address)",
  "function vote(uint256)",
  "function executeProposal(uint256)",
  "function proposalsLength() view returns (uint256)"
];
const contractAddress = "0xD03ed2100F59eD19819093eDf1bf8618cC71Dc63"; // Replace with your contract address

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [proposalCount, setProposalCount] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
  
        // Check if already connected
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          const address = accounts[0];
          setAccount(address);
        } else {
          // Only if not connected, request connection
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
        }
  
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const rawBalance = await provider.getBalance(contractAddress);
        setBalance(ethers.formatEther(rawBalance));
  
        const length = await contract.proposalsLength().catch(() => 0);
        setProposalCount(length?.toString());
      } catch (error) {
        console.error(error);
        alert("Failed to connect wallet");
      }
    } else {
      alert("MetaMask not detected");
    }
  };  

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  console.log("Rendering App component");

  return (
    <>
      <div className="app">
        <div className="header">
          <div className="branding">
            <div className="logo-circle">S</div>
            <div className="dao-title">
              <h2>BlockEd</h2>
              <h2>DAO</h2>
            </div>
          </div>
          <nav>
            <ul>
              <li><Link to="/" style={{ marginRight: "1rem", color: "white" }}>Home</Link></li>
              <li><Link to="/apply" style={{ marginRight: "1rem", color: "white" }}>Apply</Link></li>
              <li><Link to="/vote" style={{ color: "white" }}>Vote</Link></li>
            </ul>
          </nav>
          {account && (
            <div className="profile">
              <h2>Admin</h2>
              <img src="https://i.pravatar.cc/40?img=3" alt="Profile" />
            </div>
          )}
        </div>

        <div className="main-container">
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/vote" element={<Voting />} />
            </Routes>
          </div>

          <div className="wallet-section">
            {!account ? (
              <button className="connect-btn" onClick={connectWallet}>
                Connect MetaMask
              </button>
            ) : (
              <>
                <p>
                  <strong style={{ fontSize: "1.2rem" }}>Connected:</strong>{" "}
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ""}
                </p>
                <p className="eth-balance">
                  <strong>DAO Balance:</strong>
                  <span className="eth-amount">
                    {balance} ETH
                  </span>
                </p>
                <p><strong style={{ fontSize: "1.2rem" }}>Proposals Created:</strong> {proposalCount}</p>
              </>
            )}
          </div>
        </div>
      </div> 
    </>
  );
}

export default App;
