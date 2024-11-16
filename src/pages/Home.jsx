import { useWeb3Auth } from "../context/Web3AuthContext";
import { Link } from 'react-router-dom';
import Web3AuthButton from "../components/Web3AuthButton";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract/contract';
import ChainSelector from '../components/ChainSelector';

const Home = () => {
  const { user, isLoading, provider, address } = useWeb3Auth();
  const [balance, setBalance] = useState("0");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const getBalance = async () => {
      if (provider) {
        try {
          const ethersProvider = new ethers.BrowserProvider(provider);
          const signer = await ethersProvider.getSigner();
          const balance = await ethersProvider.getBalance(await signer.getAddress());
          setBalance(ethers.formatEther(balance));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    getBalance();
  }, [provider]);

  useEffect(() => {
    const checkOwner = async () => {
      if (provider) {
        try {
          const ethersProvider = new ethers.BrowserProvider(provider);
          const signer = await ethersProvider.getSigner();
          const network = await ethersProvider.getNetwork();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          const owner = await contract.owner();
          const currentAddress = await signer.getAddress();
          setIsOwner(owner.toLowerCase() === currentAddress.toLowerCase());
        } catch (error) {
          console.error("Error checking owner:", error);
        }
      }
    };

    checkOwner();
  }, [provider]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <ChainSelector />
            <Web3AuthButton />
          </div>
          {user && (
            <span className="text-white bg-slate-600 px-3 py-1 rounded">
              Balance: {balance} ETH
            </span>
          )}
        </div>
      </div>

      {user ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/register-car" 
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-2">Register Car</h2>
              <p className="text-gray-600">Register your vehicle in the system</p>
            </Link>

            <Link 
              to="/registered-cars" 
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-2">View Registered Cars</h2>
              <p className="text-gray-600">Check your registered vehicles and fines</p>
            </Link>

            {isOwner && (
              <Link 
                to="/admin" 
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>
                <p className="text-gray-600">Manage contract funds and settings</p>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Vehicle Registration System</h1>
            <p className="text-lg mb-4">Please connect your wallet to continue</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;