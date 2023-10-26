import { ethers } from "hardhat";

async function main() {
    const Verifo = await ethers.deployContract("Verifo");
    await Verifo.waitForDeployment();

    console.log(`Verifo deployed to ${Verifo.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});