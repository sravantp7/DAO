const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("---- Deploying GovernanceToken Contract ----");

  const GovernanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("---- Deployed GovernanceToken Contract ----");

  await delegate(GovernanceToken.address, deployer);
};

module.exports.tags = ["all", "governancetoken"];

async function delegate(governancetokenAddress, delegatedAddress) {
  const GovernanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governancetokenAddress
  );

  const tx = await GovernanceToken.delegate(delegatedAddress);
  await tx.wait(1);

  console.log(
    `Checkpoint : ${await GovernanceToken.numCheckpoints(delegatedAddress)}`
  );
}
