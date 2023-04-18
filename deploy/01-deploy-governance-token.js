module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("---- Deploying GovernanceToken Contract ----");

  const GovernanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 0,
  });

  log("---- Deployed GovernanceToken Contract ----");
};

module.exports.tags = ["all", "governancetoken"];
