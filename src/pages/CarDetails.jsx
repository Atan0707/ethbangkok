/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract/contract'
import { useWeb3Auth } from '../context/Web3AuthContext'

const CarDetails = () => {
  const { plateNumber } = useParams()
  const { provider, address } = useWeb3Auth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [violationCount, setViolationCount] = useState(0)
  const [totalUnpaidFines, setTotalUnpaidFines] = useState('0')
  const [violations, setViolations] = useState([])
  const [balance, setBalance] = useState("0")

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
    fetchCarDetails()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateNumber])

  const fetchCarDetails = async () => {
    setLoading(true)
    setError('')

    try {
      if (!provider) {
        throw new Error("Please connect your wallet first");
      }
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      // Get violation count
      const count = await contract.getViolationCount(plateNumber)
      setViolationCount(Number(count))

      // Get total unpaid fines
      const unpaidFines = await contract.getTotalUnpaidFines(plateNumber)
      setTotalUnpaidFines(ethers.formatEther(unpaidFines))

      // Get all violations
      const violationsList = []
      for (let i = 0; i < count; i++) {
        const violation = await contract.getViolationRecord(plateNumber, i)
        violationsList.push({
          plateNumber: violation[0],
          color: violation[1],
          brand: violation[2],
          timestamp: violation[3],
          isPaid: violation[4],
          fineAmount: ethers.formatEther(violation[5])
        })
      }
      setViolations(violationsList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePayFines = async () => {
    setLoading(true)
    setError('')

    try {
      if (!provider) {
        throw new Error("Please connect your wallet first");
      }
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      // Convert ETH to Wei for the transaction
      const totalToPayWei = ethers.parseEther(totalUnpaidFines)
      
      // Call the payFine function with the required ETH value
      const tx = await contract.payFine(plateNumber, {
        value: totalToPayWei
      })
      
      // Wait for transaction to be mined
      await tx.wait()
      
      // Refresh the car details
      await fetchCarDetails()
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Car Details - {plateNumber}
            </h1>
            <span className="bg-slate-600 text-white px-3 py-1 rounded">
              Balance: {balance} ETH
            </span>
          </div>
          {address && (
            <div className="bg-gray-50 p-2 rounded text-sm break-all">
              <span className="font-medium">Wallet Address:</span> {address}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded">
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p>Total Violations: {violationCount}</p>
              <p>Total Unpaid Fines: {totalUnpaidFines} ETH</p>
              {Number(totalUnpaidFines) > 0 && (
                <button
                  onClick={handlePayFines}
                  disabled={loading}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Pay All Fines'}
                </button>
              )}
            </div>

            {violations.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Violation History</h2>
                <div className="space-y-3">
                  {violations.map((violation, index) => (
                    <div key={index} className="border rounded p-4">
                      <p>Time: {violation.timestamp}</p>
                      <p>Car Color: {violation.color}</p>
                      <p>Car Brand: {violation.brand}</p>
                      <p>Fine Amount: {violation.fineAmount} ETH</p>
                      <p className={`font-semibold ${violation.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                        Status: {violation.isPaid ? 'Paid' : 'Unpaid'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CarDetails