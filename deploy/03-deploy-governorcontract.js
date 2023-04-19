const {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} = require("../hardhat-helper-config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { log, deploy, get } = deployments;

  const GovernanceToken = await get("GovernanceToken");
  const TimeLock = await get("TimeLock");

  log("Deploying Governor Contract");

  const args = [
    GovernanceToken.address,
    TimeLock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_PERCENTAGE,
  ];

  const Governor = await deploy("GovernorContract", {
    from: deployer,
    args: args,
    log: true,
  });

  log("Deployed Governor Contract");
};

module.exports.tags = ["all", "governor"];
