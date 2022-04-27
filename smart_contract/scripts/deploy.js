const { ethers } = require("hardhat");
const main = async () => {
    const Transaction = await ethers.getContractFactory("Transaction");
    const transactionContract = await Transaction.deploy();
  
    await transactionContract.deployed();
  
    console.log("Transaction address: ", transactionContract.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();