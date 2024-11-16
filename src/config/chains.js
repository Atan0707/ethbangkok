export const SUPPORTED_CHAINS = {
  SEPOLIA: {
    chainNamespace: "eip155",
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  SCROLL_SEPOLIA: {
    chainNamespace: "eip155",
    chainId: "0x8274f",
    rpcTarget: "https://sepolia-rpc.scroll.io",
    displayName: "Scroll Sepolia",
    blockExplorerUrl: "https://sepolia.scrollscan.com",
    ticker: "ETH",
    tickerName: "Scroll",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  // Add more chains as needed
};

export const DEFAULT_CHAIN = "SEPOLIA"; 