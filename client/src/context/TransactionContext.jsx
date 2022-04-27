import { useEffect, useState, createContext } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';
export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [formData, setformData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount')
  );
  const [transaction, setTransaction] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransaction = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask.');
      const transactionContract = getEthereumContract();
      const availableTransaction =
        await transactionContract.getAllTransaction();

      const structuredTransaction = availableTransaction.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(
          transaction.timestamp.toNumber() * 1000
        ).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / 10 ** 18,
      }));

      setTransaction(structuredTransaction);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask.');

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransaction();
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert('Please install MetaMask.');

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object');
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionContract = getEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: currentAccount,
              to: addressTo,
              gas: '0x5208', // 21000 GWEI
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await transactionContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        setIsLoading(true);
        await transactionHash.wait();
        setIsLoading(false);

        const transactionCount =
          await transactionContract.getTransactionCount();

        setTransactionCount(transactionCount.toNumber());
        window.location.reload();
      } else {
        console.log('No ethereum object');
      }
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object');
    }
  };

  const checkIfTransactionExists = async () => {
    try {
      if (ethereum) {
        const transactionContract = getEthereumContract();
        const currentTransactionCount =
          await transactionContract.getTransactionCount();
        window.localStorage.setItem(
          'transactionCount',
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error('No ethereum object');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        sendTransaction,
        transaction,
        transactionCount,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
