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

          describe("cancelListing", function () {
              it("Cancels listing", async function () {
                  await nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE);
                  await nftMarketplace.cancelListing(nft.address, TOKEN_ID);
                  const listing = await nftMarketplace.getListing(
                      nft.address,
                      TOKEN_ID
                  );
                  assert.equal(listing.seller, ethers.constants.AddressZero);
                  assert.equal(listing.price.toNumber(), 0);
              });

              it("Emits listing canceled event", async function () {
                  await nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE);
                  await expect(
                      nftMarketplace.cancelListing(nft.address, TOKEN_ID)
                  ).to.emit(nftMarketplace, "ItemCanceled");
              });

              it("Cancels only if owner cancels", async function () {
                  await nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE);
                  const accounts = await ethers.getSigners();
                  const otherAccount = accounts[1];
                  const connectedContract =
                      nftMarketplace.connect(otherAccount);
                  await expect(
                      connectedContract.cancelListing(nft.address, TOKEN_ID)
                  ).to.be.revertedWithCustomError(
                      connectedContract,
                      "NftMarketplace__NotOwner"
                  );
              });

              it("Cancels only listed nft listings", async function () {
                  await expect(
                      nftMarketplace.cancelListing(nft.address, TOKEN_ID)
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__NotListed"
                  );
              });
          });

          describe("updateListing", function () {
              const newPrice = ethers.utils.parseEther("0.02");
              it("Updates listing", async function () {
                  await nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE);
                  await nftMarketplace.updateListing(
                      nft.address,
                      TOKEN_ID,
                      newPrice
                  );
                  const { seller, price } = await nftMarketplace.getListing(
                      nft.address,
                      TOKEN_ID
                  );
                  assert.equal(seller, deployer.address);
                  assert.equal(price.toString(), newPrice.toString());
              });

              it("Emits item relisted event", async function () {
                  await nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE);
                  await expect(
                      nftMarketplace.updateListing(
                          nft.address,
                          TOKEN_ID,
                          newPrice
                      )
                  ).to.emit(nftMarketplace, "ItemListed");
              });

              it("Reverts if updating person is not owner", async function () {
                  await nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE);
                  const accounts = await ethers.getSigners();
                  const otherAccount = accounts[1];
                  const connectedContract =
                      nftMarketplace.connect(otherAccount);
                  await expect(
                      connectedContract.updateListing(
                          nft.address,
                          TOKEN_ID,
                          newPrice
                      )
                  ).to.be.revertedWithCustomError(
                      connectedContract,
                      "NftMarketplace__NotOwner"
                  );
              });

              it("Reverts if nft is not listed", async function () {
                  await expect(
                      nftMarketplace.updateListing(
                          nft.address,
                          TOKEN_ID,
                          newPrice
                      )
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__NotListed"
                  );
              });
          });

          describe("buyItem", function () {
              let buyer: SignerWithAddress;
              let connectedContract: NftMarketplace;
              this.beforeEach(async function () {
                  await nftMarketplace.listItem(nft.address, TOKEN_ID, PRICE);
                  const accounts = await ethers.getSigners();
                  buyer = accounts[1];
                  connectedContract = nftMarketplace.connect(buyer);
              });

              it("Can be bought", async function () {
                  await connectedContract.buyItem(nft.address, TOKEN_ID, {
                      value: PRICE,
                  });
                  const owner = await nft.ownerOf(TOKEN_ID);
                  assert.equal(owner, buyer.address);
              });

              it("Increments the former owners proceeds", async function () {
                  await connectedContract.buyItem(nft.address, TOKEN_ID, {
                      value: PRICE,
                  });
                  const proceeds = await nftMarketplace.getProceeds(
                      deployer.address
                  );
                  expect(proceeds.toString(), PRICE.toString());
              });

              it("Emits item bought event", async function () {
                  await expect(
                      connectedContract.buyItem(nft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                  ).to.emit(nftMarketplace, "ItemBought");
              });

              it("Reverts if price is not met", async function () {
                  await expect(
                      connectedContract.buyItem(nft.address, TOKEN_ID)
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__PriceNotMet"
                  );
              });

              it("Revets if item is not listed", async function () {
                  await expect(
                      connectedContract.buyItem(nft.address, 1, {
                          value: PRICE,
                      })
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__NotListed"
                  );
              });
          });

          describe("withdrawProceeds", function () {
              let balanceBefore: BigNumber;
              let listingTransactionCost: BigNumber;
              this.beforeEach(async function () {
                  const accounts = await ethers.getSigners();
                  const buyer = accounts[1];
                  const balanceBefore = await deployer.getBalance();
                  const txResponse = await nftMarketplace.listItem(
                      nft.address,
                      TOKEN_ID,
                      PRICE
                  );
                  const txReceipt = await txResponse.wait(1);
                  const { effectiveGasPrice, gasUsed } = txReceipt;
                  const listingTransactionCost = effectiveGasPrice.mul(gasUsed);
                  const connectedContract = nftMarketplace.connect(buyer);
                  await connectedContract.buyItem(nft.address, TOKEN_ID, {
                      value: PRICE,
                  });
              });

              it("Lets seller withdraw his proceeds", async function () {
                  const proceeds = await nftMarketplace.getProceeds(
                      deployer.address
                  );
                  const txResponse = await nftMarketplace.withdrawProceeds();
                  const txReceipt = await txResponse.wait(1);
                  const { effectiveGasPrice, gasUsed } = txReceipt;
                  const balanceAfter = await deployer.getBalance();
                  const proceedsAfter = await nftMarketplace.getProceeds(
                      deployer.address
                  );
                  assert.equal(
                      balanceAfter.toString(),
                      balanceBefore
                          .sub(effectiveGasPrice.mul(gasUsed))
                          .sub(listingTransactionCost)
                          .add(proceeds)
                          .toString()
                  );

                  assert.equal(proceedsAfter.toString(), "0");
              });

              it("Emits proceeds withdrawn event", async function () {
                  await expect(nftMarketplace.withdrawProceeds()).to.emit(
                      nftMarketplace,
                      "ProceedsWithdrawn"
                  );
              });

              it("Wont withdraw 0 proceeds", async function () {
                  const accounts = await ethers.getSigners();
                  const otherAccount = accounts[1];
                  const connectedContract =
                      nftMarketplace.connect(otherAccount);
                  await expect(
                      connectedContract.withdrawProceeds()
                  ).to.be.revertedWithCustomError(
                      nftMarketplace,
                      "NftMarketplace__NoProceeds"
                  );
              });
          });
      });
