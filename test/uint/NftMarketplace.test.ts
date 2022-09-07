import { assert, expect } from "chai";
import { BasicNftOne, NftMarketplace } from "../../typechain-types";
import { network, ethers, deployments } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const TOKEN_ID = 0;
const PRICE = ethers.utils.parseEther("0.01");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplace", function () {
          let nft: BasicNftOne;
          let nftMarketplace: NftMarketplace;
          let deployer: SignerWithAddress;
          this.beforeEach(async function () {
              const accounts = await ethers.getSigners();
              deployer = accounts[0];
              await deployments.fixture(["all"]);
              nft = await ethers.getContract("BasicNftOne", deployer.address);
              nftMarketplace = await ethers.getContract(
                  "NftMarketplace",
                  deployer
              );
              await nft.mintNft();
              await nft.approve(nftMarketplace.address, TOKEN_ID);
          });

          describe("listItem", function () {
              it("Lists an nft", async function () {
                  await nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE);
                  const { price, seller } = await nftMarketplace.getListing(
                      nft.address,
                      TOKEN_ID
                  );
                  assert.equal(price.toString(), PRICE.toString());
                  assert.equal(seller, deployer.address);
              });

              it("Lists only if nft not listed already", async function () {
                  await nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE);
                  await expect(
                      nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__AlreadyListed"
                  );
              });

              it("Lists only if listing person is owner", async function () {
                  const accounts = await ethers.getSigners();
                  const otherAccount = accounts[1];
                  const connectedContract =
                      nftMarketplace.connect(otherAccount);
                  await expect(
                      connectedContract.listItem(nft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(
                      connectedContract,
                      "NftMarketplace__NotOwner"
                  );
              });

              it("Lists only if a price is set", async function () {
                  await expect(
                      nftMarketplace.listItem(nft.address, TOKEN_ID, 0)
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__PriceMustBeAboveZero"
                  );
              });

              it("Lists only if marketplace is approved", async function () {
                  await nft.approve(ethers.constants.AddressZero, TOKEN_ID);
                  await expect(
                      nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__NotApprovedForMarketplace"
                  );
              });

              it("Emits Item listed event", async function () {
                  await expect(
                      nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE)
                  ).to.emit(nftMarketplace, "ItemListed");
              });
          });
      });
