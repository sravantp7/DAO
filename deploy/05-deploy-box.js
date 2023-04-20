const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;

  log("Deploying Box contract");

  const Box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
  });

  log(`Deployed Box Contract at : ${Box.address}`);

  // const TimeLock = await ethers.getContract("TimeLock", deployer);
  const TimeLock = await get("TimeLock");
  const BoxContract = await ethers.getContract("Box");

  const tx = await BoxContract.transferOwnership(TimeLock.address);
  await tx.wait(1);
  log("Transfered ownership to TimeLock Contract");
};

module.exports.tags = ["all", "box"];
