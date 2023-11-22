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
    "0x6686a6D1E737b56b7B9210A9a34c45DAc7B09051",
    "0xED9Aa328eaA8f8bdF6F68CF707dDcF0f180Cf531",
    "0x3F2B55627fC7d8254890f5E131D3f5CA8A9eeB6f",
    "0x006eA495758b7Ea9a05C7E1D5DaC965009b22ccF",
    "0x7f43C7F13C4d8F6b1b18b01326CA6C9099Dd4855",
    "0x04130F8679394e3A8d55568F2189c3F3BF48ecbb"
  ];

  let minters = [
    "0x3Cb11e50fe513B78fB3761b2dE3C0C6eB5008b0C",
    "0x6Ef18542040b7a60F323A80bDccbDe1912C0853f",
    "0x74635DFF898a4C832b1839135BDAD91C58d8959B",
    "0xCa543e570e4A1F6DA7cf9C4C7211692Bc105a00A",
    "0x8c99847d8A10CeE8dCfBfbD018D1b00Cd4B246e1",
    "0x8eFf9Efd56581bb5B8Ac5F5220faB9A7349160e3",
    deployer.address
  ];

  await (await dexe.changeOwners(owners, true)).wait();
  console.log("Set owners");

  await (await dexe.changeMinters(minters, true)).wait();
  console.log("Set minters");

  }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 0xc4aE9E07e4D78fC588D32Ca7736C9Ab8D8d6ef7A
