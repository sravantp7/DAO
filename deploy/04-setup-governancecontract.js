const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;

  const GovernanceToken = await ethers.getContract("GovernanceToken", deployer);
  const TimeLock = await ethers.getContract("TimeLock", deployer);
  const Governor = await ethers.getContract("GovernorContract", deployer);

  const ADDRESS_ZERO = ethers.constants.AddressZero;

  const proposerRole = await TimeLock.PROPOSER_ROLE();
  const executorRole = await TimeLock.EXECUTOR_ROLE();
  const adminRole = await TimeLock.TIMELOCK_ADMIN_ROLE();

  const proposerTx = await TimeLock.grantRole(proposerRole, Governor.address);
  await proposerTx.wait(1);

  const executorTx = await TimeLock.grantRole(executorRole, ADDRESS_ZERO); // making sure that all participants can execute proposal
  await executorTx.wait(1);

  const revokeTx = await TimeLock.revokeRole(adminRole, deployer); // revoking deployer admin role
  await revokeTx.wait(1);

  log("Role setup completed");
};

module.exports.tags = ["all", "setupgovernance"];
