// import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { ethers } from "hardhat";
// import { expect } from "chai";

// describe("Voting", function () {
//     async function deployVotingFixture() {
      
//     }

//     it("Should be able to vote", async function () {
      
//     });
// });

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Verifokyc contract", function () {
  let owner;
  let bank: { address: any; };
  let customer: { address: any; };
  let contract: { deployed: () => any; newOrganisation: (arg0: string) => any; isOrg: () => any; connect: (arg0: any) => { (): any; new(): any; newCustomer: { (arg0: string, arg1: string, arg2: any): any; new(): any; }; modifyCustomerData: { (arg0: string, arg1: string, arg2: any): any; new(): any; }; checkStatus: { (): any; new(): any; }; changeStatusToAccepted: { (arg0: any): any; new(): any; }; changeStatusToRejected: { (arg0: any): any; new(): any; }; viewRequests: { (): any; new(): any; }; viewName: { (arg0: any): any; new(): any; }; }; isCus: () => any; viewCustomerData: (arg0: any) => any; };

  beforeEach(async () => {
    [owner, bank, customer] = await ethers.getSigners();

    const Verifokyc = await ethers.getContractFactory("Verifokyc");
    contract = await Verifokyc.deploy();
    await contract.deployed();
  });

  it("should allow an Organisation to register and check if it is an Organisation", async function () {
    await contract.newOrganisation("BankName");
    expect(await contract.isOrg()).to.be.true;
  });

  it("should allow a Customer to register and check if it is a Customer", async function () {
    await contract.newOrganisation("BankName");
    await contract.connect(bank).newCustomer("CustomerName", "hash", bank.address);
    expect(await contract.isCus()).to.be.true;
  });

  it("should not allow registering a Customer if they already exist", async function () {
    await contract.newOrganisation("BankName");
    await contract.connect(bank).newCustomer("CustomerName", "hash", bank.address);
    await expect(
      contract.connect(bank).newCustomer("AnotherCustomer", "hash", bank.address)
    ).to.be.revertedWith("Customer Already Exists!");
  });

  it("should not allow registering a Customer with a non-existing bank", async function () {
    await expect(
      contract.connect(bank).newCustomer("CustomerName", "hash", bank.address)
    ).to.be.revertedWith("No such Bank!");
  });

  it("should allow Customers to change their data", async function () {
    await contract.newOrganisation("BankName");
    await contract.connect(bank).newCustomer("CustomerName", "hash", bank.address);
    const newName = "NewName";
    const newHash = "newHash";
    await contract.connect(customer).modifyCustomerData(newName, newHash, bank.address);
    const data = await contract.viewCustomerData(customer.address);
    expect(data).to.equal(newHash);
  });

  it("should allow Banks to check the status of a KYC request", async function () {
    await contract.newOrganisation("BankName");
    await contract.connect(bank).newCustomer("CustomerName", "hash", bank.address);
    const status = await contract.connect(bank).checkStatus();
    expect(status).to.equal(0); // Status.Pending
  });

  it("should allow Banks to change the status of a KYC request to Accepted", async function () {
    await contract.newOrganisation("BankName");
    await contract.connect(bank).newCustomer("CustomerName", "hash", bank.address);
    await contract.connect(bank).changeStatusToAccepted(customer.address);
    const status = await contract.connect(bank).checkStatus();
    expect(status).to.equal(1); // Status.Accepted
  });

  it("should allow Banks to change the status of a KYC request to Rejected", async function () {
    await contract.newOrganisation("BankName");
    await contract.connect(bank).newCustomer("CustomerName", "hash", bank.address);
    await contract.connect(bank).changeStatusToRejected(customer.address);
    const status = await contract.connect(bank).checkStatus();
    expect(status).to.equal(2); // Status.Rejected
  });

  it("should allow Banks to view KYC requests pointed at them", async function () {
    await contract.newOrganisation("BankName");
    await contract.connect(bank).newCustomer("CustomerName", "hash", bank.address);
    const requests = await contract.connect(bank).viewRequests();
    expect(requests.length).to.equal(1);
    expect(requests[0]).to.equal(customer.address);
  });

  it("should allow an Organisation to view the name of a Customer", async function () {
    await contract.newOrganisation("BankName");
    await contract.connect(bank).newCustomer("CustomerName", "hash", bank.address);
    const name = await contract.connect(bank).viewName(customer.address);
    expect(name).to.equal("CustomerName");
  });

  // Add more test cases as needed

});
