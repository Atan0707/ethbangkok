import { useWeb3Auth } from '../context/Web3AuthContext';

const networkDisplayNames = {
    scrollSepolia: 'Scroll Sepolia',
    ethSepolia: 'Ethereum Sepolia',
    baseSepolia: 'Base Sepolia',
    zircuitSepolia: 'Zircuit Sepolia'
};

const ChainSelector = () => {
    const { currentChain, switchChain, availableChains } = useWeb3Auth();

    return (
        <select 
            value={currentChain}
            onChange={(e) => switchChain(e.target.value)}
            className="bg-white border rounded px-3 py-1"
        >
            {availableChains.map((chain) => (
                <option key={chain} value={chain}>
                    {networkDisplayNames[chain]}
                </option>
            ))}
        </select>
    );
};

export default ChainSelector;