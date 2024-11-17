import { createContext, useContext, useState, useEffect } from 'react';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { ethers } from "ethers";

const Web3AuthContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
export const Web3AuthProvider = ({ children }) => {
    const [web3auth, setWeb3auth] = useState(null);
    const [provider, setProvider] = useState(null);
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

    const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x8274f",
        rpcTarget: "https://sepolia-rpc.scroll.io",
        displayName: "Scroll Sepolia Testnet",
        blockExplorerUrl: "https://sepolia.scrollscan.com",
        ticker: "ETH",
        tickerName: "Ethereum",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    };

    useEffect(() => {
        const init = async () => {
            try {
                const privateKeyProvider = new EthereumPrivateKeyProvider({ 
                    config: { chainConfig } 
                });

                const web3authInstance = new Web3AuthNoModal({
                    clientId,
                    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
                    privateKeyProvider,
                });

                const authadapter = new AuthAdapter();
                web3authInstance.configureAdapter(authadapter);

                await web3authInstance.init();
                setWeb3auth(web3authInstance);

                if (web3authInstance.provider) {
                    setProvider(web3authInstance.provider);
                    const userInfo = await web3authInstance.getUserInfo();
                    setUser(userInfo);
                    const ethersProvider = new ethers.BrowserProvider(web3authInstance.provider);
                    const signer = await ethersProvider.getSigner();
                    const userAddress = await signer.getAddress();
                    setAddress(userAddress);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    const login = async () => {
        if (!web3auth) {
            throw new Error("web3auth not initialized");
        }
        const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
            loginProvider: "google",
        });
        setProvider(web3authProvider);
        const userInfo = await web3auth.getUserInfo();
        setUser(userInfo);
        const ethersProvider = new ethers.BrowserProvider(web3authProvider);
        const signer = await ethersProvider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
    };

    const logout = async () => {
        if (!web3auth) {
            throw new Error("web3auth not initialized");
        }
        await web3auth.logout();
        setProvider(null);
        setUser(null);
        setAddress(null);
    };

    const value = {
        web3auth,
        provider,
        user,
        address,
        isLoading,
        login,
        logout
    };

    return (
        <Web3AuthContext.Provider value={value}>
            {children}
        </Web3AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWeb3Auth = () => {
    const context = useContext(Web3AuthContext);
    if (context === undefined) {
        throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
    }
    return context;
};