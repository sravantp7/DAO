const { network } = require("hardhat");

// This function is used to Mine blocks in localnetwork
// because when a proposal is created there is a votingDelay, after that delay only
// user can mark their vote (votingDelay is measured in block so we mine blocks)
// (ONLY FOR LOCAL NETWORK)
async function mineBlocks(count) {
  for (let i = 0; i < count; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`Mined ${count} blocks`);
}

module.exports = {
  mineBlocks,
};
