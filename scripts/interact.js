const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Load the contract ABI from the artifacts
    const artifact = require("../artifacts/contracts/ScholarshipDAO.sol/ScholarshipDAO.json");
    const abi = artifact.abi;
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address

    // Create an instance of the contract
    const scholarshipDAO = new ethers.Contract(contractAddress, abi, deployer);

    // Call a function from the contract, for example, get the admin
    const admin = await scholarshipDAO.admin();
    console.log("Admin address:", admin);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
