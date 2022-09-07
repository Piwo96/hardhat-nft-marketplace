import { assert, expect } from "chai";
import { BasicNftOne, NftMarketplace } from "../../typechain-types";
import { network, ethers, deployments } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

const TOKEN_ID = 0;
const PRICE = ethers.utils.parseEther("0.01");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplace", function () {
          let nftOne: BasicNftOne;
          let nftMarketplace: NftMarketplace;
          let deployer: SignerWithAddress;
          this.beforeEach(async function () {
              const accounts = await ethers.getSigners();
              deployer = accounts[0];
              await deployments.fixture(["all"]);
              nftOne = await ethers.getContract(
                  "BasicNftOne",
                  deployer.address
              );
              nftMarketplace = await ethers.getContract(
                  "NftMarketplace",
                  deployer
              );
              await nftOne.mintNft();
              await nftOne.approve(nftMarketplace.address, TOKEN_ID);
          });

          describe("listItem", function () {
              it("Lists only if nft not already listed", async function () {
                  await nftMarketplace.listItem(
                      nftOne.address,
                      TOKEN_ID,
                      PRICE
                  );
                  await expect(
                      nftMarketplace.listItem(nftOne.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__AlreadyListed"
                  );
              });
          });
      });
