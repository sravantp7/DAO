const { ethers, network } = require("hardhat");
const {
  FUNC_TO_CALL,
  ARGS,
  DESCRIPTION,
  MIN_DEPLAY,
  developmentChains,
} = require("../hardhat-helper-config");
const { mineBlocks, moveTime } = require("../helper");

async function queueAndExecute(functionToCall, args, proposeDescription) {
  const Box = await ethers.getContract("Box");
  const Governor = await ethers.getContract("GovernorContract");

  // return encode hex data which we can use as data for transactions
  const encodedFunctionCall = Box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  // Converts string description to bytes32 (because execute() function inside Governor contract take bytes32 value of des..)
  // keccak256 function only takes bytes input.
  // toUtf8Bytes() converts string to bytes data
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(proposeDescription)
  );

  // queuing the proposal
  const queueTx = await Governor.queue(
    [Box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queueTx.wait(1);

  console.log("Proposal is in Queue");

  // Jumping Time - because when proposal is in queue we need to wait MIN_DEPLAY time before executing
  if (developmentChains.includes(network.name)) {
    await mineBlocks(1);
    await moveTime(MIN_DEPLAY);
  }

  // execute
  const executeTx = await Governor.execute(
    [Box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  const receiptTx = await executeTx.wait(1);
  console.log(`Executed Proposal : ${receiptTx.events[0].args.proposalId}`);

  // Checking box contract new Value
  const newValue = await Box.retrieve();
  console.log(`New value is : ${newValue.toString()}`);
}

queueAndExecute(FUNC_TO_CALL, [ARGS], DESCRIPTION)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

module.exports = {
  queueAndExecute,
};
