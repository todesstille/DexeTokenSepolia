const hre = require("hardhat");

async function main() {
  const Proxy = await hre.ethers.getContractFactory("ERC1967Proxy");
  const BABT = await hre.ethers.getContractFactory("BABTMock");
  const implementaton = await BABT.deploy();

  await implementaton.deployed();

  const proxy = await Proxy.deploy(implementaton.address, "0x0a362d5b");
  await proxy.deployed();

  console.log(
    `Implementation deployed to ${implementaton.address}`
  );

  console.log(
    `Proxy deployed to ${proxy.address}`
  );

  // await (await dexe.__DexeToken_init()).wait();
  // console.log("Initialized");


  }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xc4aE9E07e4D78fC588D32Ca7736C9Ab8D8d6ef7A
