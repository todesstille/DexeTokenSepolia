const hre = require("hardhat");

async function main() {
  const Dexe = await hre.ethers.getContractFactory("DexeToken");
  const dexe = await Dexe.deploy();

  await dexe.deployed();

  console.log(
    `Dexe deployed to ${dexe.address}`
  );

  await (await dexe.__DexeToken_init()).wait();
  console.log("Initialized");

  let [deployer] = await hre.ethers.getSigners();

  let owners = [
    "0x04130F8679394e3A8d55568F2189c3F3BF48ecbb",
  ];

  let minters = [
    "0x04130F8679394e3A8d55568F2189c3F3BF48ecbb",
    deployer.address
  ];

  await (await dexe.changeOwners(owners, true)).wait();
  console.log("Set owners");

  await (await dexe.changeMinters(minters, true)).wait();
  console.log("Set minters");

  await (await dexe.mint("0x04130F8679394e3A8d55568F2189c3F3BF48ecbb", "20000000000000000000000")).wait();
  console.log("Minted supply");

  await (await dexe.changeMinters([deployer.address], false)).wait();
  console.log("Removed deployer from minters");
  
  await (await dexe.changeOwners([deployer.address], false)).wait();
  console.log("Removed deployer from owners");

  }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xc4aE9E07e4D78fC588D32Ca7736C9Ab8D8d6ef7A
