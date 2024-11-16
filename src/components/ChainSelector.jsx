import { useWeb3Auth } from '../context/Web3AuthContext';
import { SUPPORTED_CHAINS } from '../config/chains';

const ChainSelector = () => {
    const { currentChain, switchChain, supportedChains } = useWeb3Auth();

    return (
        <select 
            value={currentChain}
            onChange={(e) => switchChain(e.target.value)}
            className="bg-white border rounded px-3 py-1"
        >
            {supportedChains.map((chainId) => (
                <option key={chainId} value={chainId}>
                    {SUPPORTED_CHAINS[chainId].displayName}
                </option>
            ))}
        </select>
    );
};

export default ChainSelector; 