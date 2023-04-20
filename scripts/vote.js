const { ethers, network } = require("hardhat");
const fs = require("fs-extra");
const {
  developmentChains,
  VOTING_PERIOD,
} = require("../hardhat-helper-config");
const { mineBlocks } = require("../helper");

// Vote Types
const VOTE_NO = 0;
const VOTE_YES = 1;
const VOTE_ABSTAIN = 2;

async function vote(proposalId) {
  console.log("Voting...");
  const Governor = await ethers.getContract("GovernorContract");
  const voteTx = await Governor.castVoteWithReason(
    proposalId,
    VOTE_YES,
    "I like the number 100"
  );
  await voteTx.wait(1);
  let proposalState = await Governor.state(proposalId);
  console.log(`Proposal State during voting period is ${proposalState}`);

  // here we are jumping time to check whether the proposalState is getting change or not.
  // Proposal state will be changed to queued after votingPeriod ends
  if (developmentChains.includes(network.name)) {
    await mineBlocks(VOTING_PERIOD + 1);
  }

  proposalState = await Governor.state(proposalId);
  console.log(`Proposal State after voting period ends is ${proposalState}`);
}

// Reading data from proposals.json file and convert it into json
const proposals = JSON.parse(fs.readFileSync("proposals.json", "utf8"));
// Fetching the first proposalId from the array using chainId and index 0
const proposalId = proposals[network.config.chainId][0];

vote(proposalId)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

module.exports = {
  vote,
};
