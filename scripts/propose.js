const { ethers, network } = require("hardhat");
const {
  FUNC_TO_CALL,
  ARGS,
  DESCRIPTION,
  VOTING_DELAY,
  developmentChains,
  PROPOSAL_FILE,
} = require("../hardhat-helper-config");
const { mineBlocks } = require("../helper");
const fs = require("fs-extra");

async function makeProposal(functionToCall, args, proposeDescription) {
  const Governor = await ethers.getContract("GovernorContract");
  const Box = await ethers.getContract("Box");

  // return encode hex data which we can use as data for transactions
  const encodedFunctionCall = Box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  const proposeTxResponse = await Governor.propose(
    [Box.address],
    [0],
    [encodedFunctionCall],
    proposeDescription
  );
  const proposeReceipt = await proposeTxResponse.wait(1);
  console.log(proposeReceipt.status); // 1 - success, 0 - failed

  // make sure that the mining code will execute only in localnetwork
  if (developmentChains.includes(network.name)) {
    // Mining Blocks to jump time
    await mineBlocks(VOTING_DELAY + 1);
  }

  // when a proposal is created it will throw an event with details
  // so by using txReceipt we can retrieve that details
  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log(`ProposalId: ${proposalId.toString()}`);

  // writing data to a file for later use.
  fs.writeFileSync(
    PROPOSAL_FILE,
    JSON.stringify({
      [network.config.chainId.toString()]: [proposalId.toString()],
    })
  );
}

makeProposal(FUNC_TO_CALL, [ARGS], DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

module.exports = {
  makeProposal,
};
