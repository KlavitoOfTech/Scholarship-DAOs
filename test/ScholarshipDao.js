const { expect } = require("chai");
require("@nomicfoundation/hardhat-chai-matchers");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-ethers");

const { parseEther } = ethers;

describe("ScholarshipDAO", function () {
  let ScholarshipDAO;
  let scholarshipDAO;
  let admin;
  let voter;
  let nonVoter;

  beforeEach(async function () {
    [admin, voter, nonVoter] = await ethers.getSigners();
    ScholarshipDAO = await ethers.getContractFactory("ScholarshipDAO");
    scholarshipDAO = await ScholarshipDAO.deploy();
  });

  it("Should deploy the contract and set the admin", async function () {
    expect(await scholarshipDAO.admin()).to.equal(admin.address);
  });

  it("Should register a voter", async function () {
    await scholarshipDAO.registerVoter(voter.address);
    expect(await scholarshipDAO.voters(voter.address)).to.be.true;
  });

  it("Should create a proposal", async function () {
    await scholarshipDAO.registerVoter(voter.address);
    const amount = parseEther("0.001");
    await scholarshipDAO.createProposal("Proposal 1", "This is a proposal description.", amount, voter.address);

    const proposal = await scholarshipDAO.proposals(0);
    expect(proposal.name).to.equal("Proposal 1");
    expect(proposal.description).to.equal("This is a proposal description.");
    expect(proposal.amount.toString()).to.equal(amount.toString());
    expect(proposal.recipient).to.equal(voter.address);
  });

  it("Should allow voting on a proposal", async function () {
    await scholarshipDAO.registerVoter(voter.address);
    const amount = parseEther("0.001");
    await scholarshipDAO.createProposal("Proposal 1", "This is a proposal description.", amount, voter.address);
    await scholarshipDAO.connect(voter).vote(0);

    const proposal = await scholarshipDAO.proposals(0);
    expect(Number(proposal.votes)).to.equal(1); 
  });

  it("Should execute a proposal", async function () {
    await scholarshipDAO.registerVoter(voter.address);
    const amount = parseEther("0.001");
    await scholarshipDAO.createProposal("Proposal 1", "This is a proposal description.", amount, voter.address);

    await scholarshipDAO.connect(voter).vote(0);
    await scholarshipDAO.executeProposal(0);

    const proposal = await scholarshipDAO.proposals(0);
    expect(proposal.executed).to.be.true;
  });

  it("Should fail if a non-voter tries to vote", async function () {
    await expect(scholarshipDAO.connect(nonVoter).vote(0)).to.be.revertedWith("Not a registered voter");
  });
});
