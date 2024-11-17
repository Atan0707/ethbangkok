import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/contract";
import { useWeb3Auth } from "../context/Web3AuthContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { provider } = useWeb3Auth();
  const [contractBalance, setContractBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    checkOwner();
    getContractBalance();
  }, [provider]);

  const checkOwner = async () => {
    if (provider) {
      try {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await ethersProvider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        const owner = await contract.owner();
        const currentAddress = await signer.getAddress();
        setIsOwner(owner.toLowerCase() === currentAddress.toLowerCase());
      } catch (error) {
        console.error("Error checking owner:", error);
      }
    }
  };

  const getContractBalance = async () => {
    if (provider) {
      try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const balance = await ethersProvider.getBalance(CONTRACT_ADDRESS);
        setContractBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error fetching contract balance:", error);
      }
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!provider) {
        throw new Error("Please connect your wallet first");
      }

      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.withdrawFunds();
      await tx.wait();

      setSuccess("Funds withdrawn successfully!");
      await getContractBalance(); // Refresh the balance
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Access Denied</h1>
          <p className="text-center mb-4">
            Only the contract owner can access this page.
          </p>
          <Link
            to="/"
            className="block w-full text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Contract Balance</h2>
          <p className="text-2xl font-bold">{contractBalance} ETH</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleWithdraw}
            disabled={loading || contractBalance === "0"}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Processing..." : "Withdraw All Funds"}
          </button>
          <Link
            to="/suggestions"
            className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            View Analysis
          </Link>
          <Link
            to="/"
            className="block w-full text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
