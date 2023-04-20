const { ethers } = require("hardhat");
const { FUNC_TO_CALL, ARGS, DESCRIPTION } = require("../hardhat-helper-config");

async function makeProposal(functionToCall, args, proposeDescription) {
  const Governor = await ethers.getContract("GovernorContract");
  const Box = await ethers.getContract("Box");

  const encodedFunctionCall = Box.interface.encodeFunctionData(
    functionToCall,
    args
  ); // return encode hex data which we can use as data for transactions

  const proposeTxResponse = await Governor.propose(
    [Box.address],
    [0],
    [encodedFunctionCall],
    proposeDescription
  );
  const proposeReceipt = await proposeTxResponse.wait(1);
  console.log(proposeReceipt.status);
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
