// /* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract/contract'
import { Link } from 'react-router-dom'
import { useWeb3Auth } from '../context/Web3AuthContext'

const RegisterCar = () => {
    const { user } = useWeb3Auth()
    const [loading, setLoading] = useState(false)
    const [icNumber, setIcNumber] = useState('')
    const [plateNumber, setPlateNumber] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email)
        }
    }, [user])

    const register = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            if (!window.ethereum) {
                throw new Error("Please install MetaMask to use this feature");
            }

            const provider = new ethers.BrowserProvider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

            // Register plate number with email
            const tx = await contract.registerPlateNumber(icNumber, plateNumber, email)
            await tx.wait()

            setSuccess('Car registered successfully!')
            setIcNumber('')
            setPlateNumber('')
            setEmail('')

            // Listen for the event
            contract.on("PlateNumberRegistered", (registeredIC, registeredPlate) => {
                console.log(`Plate number registered: ${registeredIC}, ${registeredPlate}`)
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Register your car</h1>

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

                <form onSubmit={register} className="space-y-4">
                    <div>
                        <label htmlFor="icNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            IC Number
                        </label>
                        <input
                            id="icNumber"
                            type="text"
                            value={icNumber}
                            onChange={(e) => setIcNumber(e.target.value)}
                            placeholder="Enter IC number"
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Plate Number
                        </label>
                        <input
                            id="plateNumber"
                            type="text"
                            value={plateNumber}
                            onChange={(e) => setPlateNumber(e.target.value)}
                            placeholder="Enter plate number"
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Registering...' : 'Register Car'}
                        </button>

                        <Link
                            to="/"
                            className="block w-full text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterCar