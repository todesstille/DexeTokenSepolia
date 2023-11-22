const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
// const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types");


describe("Dexe token", function () {

  before(async () => {
    [admin, alice, bob, charlie] = await ethers.getSigners();
    Dexe = await ethers.getContractFactory("DexeToken");
  });

  describe("Basic functionality", function () {

    beforeEach(async () => {
      dexe = await Dexe.deploy();
      await dexe.__DexeToken_init();
    });
  
    it("deploy parameters", async () => {
      expect(await dexe.name()).to.equal("DeXe Token");
      expect(await dexe.symbol()).to.equal("DEXE");
      expect(await dexe.totalSupply()).to.equal(0);
      expect(await dexe.getOwners()).to.deep.equal([admin.address]);
      expect(await dexe.getMinters()).to.deep.equal([]);
    });

    it("cant initialize twice", async () => {
      await expect(dexe.__DexeToken_init()).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("must revert", async () => {
      await expect(dexe.connect(alice).changeOwners([bob.address], true))
        .to.be.revertedWith("Ownable: caller is not the owner");
      await expect(dexe.connect(alice).changeMinters([bob.address], true))
        .to.be.revertedWith("Ownable: caller is not the owner");
      await expect(dexe.connect(alice).mint(bob.address, 1))
        .to.be.revertedWith("Caller is not a minter");
      await expect(dexe.connect(alice).burn(bob.address, 1))
        .to.be.revertedWith("Caller is not a minter");
    });

    it("could add owners", async () => {
      await dexe.changeOwners([alice.address], true);
      expect(await dexe.getOwners()).to.deep.equal([admin.address, alice.address]);
    });

    it("could remove owners", async () => {
      await dexe.changeOwners([alice.address], true);
      expect(await dexe.getOwners()).to.deep.equal([admin.address, alice.address]);
      await dexe.changeOwners([admin.address], false);
      expect(await dexe.getOwners()).to.deep.equal([alice.address]);
    });

    it("could set minters", async () => {
      await dexe.changeMinters([alice.address], true);
      expect(await dexe.getMinters()).to.deep.equal([alice.address]);
    });

    it("could remove minters", async () => {
      await dexe.changeMinters([alice.address, bob.address], true);
      expect(await dexe.getMinters()).to.deep.equal([alice.address, bob.address]);
      await dexe.changeMinters([alice.address], false);
      expect(await dexe.getMinters()).to.deep.equal([bob.address]);
    });

    it("could mint", async () => {
      await expect(dexe.connect(alice).mint(bob.address, 1))
        .to.be.revertedWith("Caller is not a minter");
      await dexe.changeMinters([alice.address], true);
      await dexe.connect(alice).mint(bob.address, 1000);
      expect(await dexe.balanceOf(bob.address)).to.equal(1000);
      expect(await dexe.totalSupply()).to.equal(1000);
    });

    it("could burn", async () => {
      await expect(dexe.connect(alice).mint(bob.address, 1))
        .to.be.revertedWith("Caller is not a minter");
      await dexe.changeMinters([alice.address], true);
      await dexe.connect(alice).mint(bob.address, 1000);
      expect(await dexe.balanceOf(bob.address)).to.equal(1000);
      expect(await dexe.totalSupply()).to.equal(1000);
      await dexe.connect(alice).burn(bob.address, 1000);
      expect(await dexe.balanceOf(bob.address)).to.equal(0);
      expect(await dexe.totalSupply()).to.equal(0);
    });
  });

  describe("Upgradeability", function () {
    beforeEach(async () => {
      logic = await Dexe.deploy();
      const ERC1967Proxy = await ethers.getContractFactory("ERC1967Proxy");
      erc1967 = await ERC1967Proxy.deploy(logic.address, "0x");
      dexe = await ethers.getContractAt("DexeToken", erc1967.address);
      await dexe.__DexeToken_init();
    });

    it("Correct implementation", async () => {
      expect(await dexe.getImplementation()).to.equal(logic.address);
    });

    it("Cant upgrade by not owner", async () => {
      logic1 = await Dexe.deploy();
      await expect(dexe.connect(alice).upgradeTo(logic1.address))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Could upgrade", async () => {
      logic1 = await Dexe.deploy();
      await dexe.upgradeTo(logic1.address);
      expect(await dexe.getImplementation()).to.equal(logic1.address);
    });
  });
});