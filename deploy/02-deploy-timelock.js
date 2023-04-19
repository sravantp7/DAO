const {
  MIN_DEPLAY,
  PROPOSERS,
  EXECUTORS,
} = require("../hardhat-helper-config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { log, deploy } = deployments;

  log("Deploying TimeLock Contract");

  const args = [MIN_DEPLAY, PROPOSERS, EXECUTORS];

  const TimeLock = await deploy("TimeLock", {
    from: deployer,
    args: args,
    log: true,
  });

  log("Deployed TimeLock Contract");
};

module.exports.tags = ["all", "timelock"];
