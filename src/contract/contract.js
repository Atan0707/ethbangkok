import TrafficViolation from "./TrafficViolation.json"

const CONTRACT_ADDRESSES = {
    scrollSepolia: "0xe7E64f18F2345427d588e3fca0d6340b91047ebF",
    ethSepolia: "0x1dAD36Db37fc2990001eB6d94c7219A1114eDF8B", // Your Ethereum Sepolia contract address  
    baseSepolia: "0x8477e5a8468D6e3FB8B3aA6932Cd6a6b0E35d5A5", // Your Base Sepolia contract address
    zircuitSepolia: "0x..." // Your Zircuit Sepolia contract address
};

export const getContractAddress = (chainId) => {
    const chainMap = {
        "0x8274f": "scrollSepolia",
        "0xaa36a7": "ethSepolia",
        "0x14a33": "baseSepolia",
        "0x2B0C8": "zircuitSepolia"
    };
    const network = chainMap[chainId];
    return CONTRACT_ADDRESSES[network];
};

export const CONTRACT_ABI = TrafficViolation;