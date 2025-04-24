import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

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
const contractAddress = "0xD03ed2100F59eD19819093eDf1bf8618cC71Dc63"; // replace this

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [proposalCount, setProposalCount] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const rawBalance = await provider.getBalance(contractAddress);
      setBalance(ethers.formatEther(rawBalance));

      const length = await contract.proposalsLength().catch(() => 0);
      setProposalCount(length?.toString());
    } else {
      alert("MetaMask not detected");
    }
  };

  return (
    <div className="app">
      <div className="header">
        <div className="branding">
          <div className="logo-circle">S</div>
          <div className="dao-title">
            <h2>Scholarship</h2>
            <h2>DAO</h2>
          </div>
        </div>
        {account && (
          <div className="profile">
            <img src="https://i.pravatar.cc/40?img=3" alt="Profile" />
          </div>
        )}
      </div>

      <div className="wallet-section">
        {!account ? (
          <button className="connect-btn" onClick={connectWallet}>
            Connect MetaMask
          </button>
        ) : (
          <>
            <p><strong>Connected:</strong> {account}</p>
            <p><strong>DAO Balance:</strong> {balance} ETH</p>
            <p><strong>Proposals Created:</strong> {proposalCount}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
