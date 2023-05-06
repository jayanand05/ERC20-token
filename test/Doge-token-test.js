const { expect, should } = require("chai");
const { ethers } = require("hardhat");

describe("DogeToken", function () {
  let dogeTokenFactory,
    dogeToken,
    owner,
    addr1,
    addr2,
    totalcap = 100000000,
    totalBlockReward = 50;
  beforeEach(async function () {
    dogeTokenFactory = await ethers.getContractFactory("DogeToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    dogeToken = await dogeTokenFactory.deploy(totalcap, totalBlockReward);
  });

  it("should set the right owner", async function () {
    expect(await dogeToken.owner()).to.equal(owner.address);
  });
  it("should assign the total supply to the owner", async function () {
    const ownerBalance = await dogeToken.balanceOf(owner.address);
    expect(await dogeToken.totalSupply()).to.equal(ownerBalance);
  });
  it("should match the max cap with totalcap", async function () {
    const cap = await dogeToken.cap();
    expect(Number(ethers.utils.formatEther(cap))).to.equal(totalcap);
  });
  it("should match the blockreward to the totalBlockReward", async function () {
    const blockReward = await dogeToken.blockReward();
    expect(Number(ethers.utils.formatEther(blockReward))).to.equal(
      totalBlockReward
    );
  });

  describe("Transactions", function () {
    it("should transact between accounts", async function () {
      await dogeToken.transfer(addr1.address, 50);
      const addr1Balance = await dogeToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
    });

    it("should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await dogeToken.balanceOf(owner.address);

      await expect(
        dogeToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      expect(await dogeToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
