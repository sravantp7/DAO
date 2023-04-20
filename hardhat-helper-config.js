const VOTING_DELAY = 1; // 1 block
const VOTING_PERIOD = 50400; // 1 week in blocks
const QUORUM_PERCENTAGE = 4;

const MIN_DEPLAY = 3600; // in seconds
const PROPOSERS = [];
const EXECUTORS = [];

// These values used to create the encodedFunctionCall
// That is we are calling store function in Box contract with value 100
// So this proposal is for updating value in Box contract with new one.
const FUNC_TO_CALL = "store";
const ARGS = 100;
const DESCRIPTION = "Proposal #1 - Update Box contract value by 100";

const developmentChains = ["hardhat", "localhost"];
const PROPOSAL_FILE = "proposals.json";

module.exports = {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
  MIN_DEPLAY,
  PROPOSERS,
  EXECUTORS,
  FUNC_TO_CALL,
  ARGS,
  DESCRIPTION,
  developmentChains,
  PROPOSAL_FILE,
};
