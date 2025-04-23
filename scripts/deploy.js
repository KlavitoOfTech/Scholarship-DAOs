const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const ScholarshipDAO = await ethers.getContractFactory("ScholarshipDAO");
    const scholarshipDAO = await ScholarshipDAO.deploy();
    console.log("ScholarshipDAO contract deployed to:", scholarshipDAO.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
