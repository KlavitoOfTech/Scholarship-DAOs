// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ScholarshipDAO {
    address public admin;

    struct Proposal {
        string name;
        string description;
        uint256 amount;
        address payable recipient;
        uint256 votes;
        bool executed;
    }

    mapping(address => bool) public voters;
    Proposal[] public proposals;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function registerVoter(address _voter) external onlyAdmin {
        voters[_voter] = true;
    }

    function createProposal(
        string memory _name,
        string memory _description,
        uint256 _amount,
        address payable _recipient
    ) external onlyAdmin {
        proposals.push(
            Proposal({
                name: _name,
                description: _description,
                amount: _amount,
                recipient: _recipient,
                votes: 0,
                executed: false
            })
        );
    }

    function vote(uint256 _proposalId) external {
        require(voters[msg.sender], "Not a registered voter");
        require(!proposals[_proposalId].executed, "Already executed");
        proposals[_proposalId].votes++;
    }

    function executeProposal(uint256 _proposalId) external onlyAdmin {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
        uint256 contractBalance = address(this).balance;
        require(contractBalance >= proposal.amount, "Not enough funds");

        (bool success, ) = proposal.recipient.call{value: proposal.amount}("");
        require(success, "Transfer failed");
    }

    function proposalsLength() external view returns (uint256) {
        return proposals.length;
    }

    function getWinningProposal() public view returns (uint256) {
        uint256 winningVoteCount = 0;
        uint256 winningProposalId = 0;

        for (uint256 i = 0; i < proposals.length; i++) {
          if (proposals[i].votes > winningVoteCount) {
              winningVoteCount = proposals[i].votes;
              winningProposalId = i;
          }
        }
        return winningProposalId;
    }


    function finalizeWinner() external onlyAdmin {
        require(proposals.length > 0, "No proposals available");

        uint256 winningProposalId = getWinningProposal();
        Proposal storage winningProposal = proposals[winningProposalId];

        require(!winningProposal.executed, "Already executed");

        winningProposal.executed = true;

        uint256 contractBalance = address(this).balance;
        require(contractBalance >= winningProposal.amount, "Not enough funds");

        (bool success, ) = winningProposal.recipient.call{value: winningProposal.amount}("");
        require(success, "Winner transfer failed");
    }

    receive() external payable {}
}
