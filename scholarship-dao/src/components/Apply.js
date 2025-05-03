import React, { useState } from "react";
import { ethers } from "ethers";
import "../styles/Apply.css";

const contractABI = [
  "function apply(string memory _name, string memory _reason) public",
];
const contractAddress = "0xD03ed2100F59eD19819093eDf1bf8618cC71Dc63"; 

function Apply() {
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      alert("Please install MetaMask to apply!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.apply(name, reason);
      await tx.wait(); // wait for transaction confirmation
      setTxHash(tx.hash);
    } catch (error) {
      console.log("Application failed:", error);
    }
  };

  // Console log to confirm rendering
  console.log("Rendering Apply Component");

  return (
    <div className="apply-page">
      <h2>Apply for Scholarship</h2>
      <form onSubmit={handleApply} className="apply-form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Reason for Applying"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <button type="submit">Submit Application</button>
      </form>

      {txHash && (
        <div className="confirmation">
          <p>✅ Application submitted!</p>
          <p>Transaction Hash:</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}

export default Apply;
