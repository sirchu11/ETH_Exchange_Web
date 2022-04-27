import abi from './Transactions.json';

export const contractABI = abi.abi;

export const contractAddress = '0x9Cb390626d14D5bB7a7749aF95cd1a80591530cF';

export const shortenAddress = (address) =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
