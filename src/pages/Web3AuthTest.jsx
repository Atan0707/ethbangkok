import React from 'react'
import { CHAIN_NAMESPACES } from "@web3auth/base";

const Web3AuthTest = () => {
    const [provider, setProvider] = "";

    const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth",
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode etc
        displayName: "Ethereum Mainnet",
        blockExplorerUrl: "https://etherscan.io",
        ticker: "ETH",
        tickerName: "Ethereum",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      };

      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig },
      });

      const web3AuthOptions: Web3AuthOptions = {
        clientId,
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        privateKeyProvider,
      }
      const web3auth = new Web3Auth(web3AuthOptions);
      
      const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
      adapters.forEach((adapter: IAdapter<unknown>) => {
        web3auth.configureAdapter(adapter);
      });

      const loggedInView = (
        <>
          <div className="flex-container">
            <div>
              <button onClick={getUserInfo} className="card">
                Get User Info
              </button>
            </div>
            <div>
              <button onClick={getAccounts} className="card">
                Get Accounts
              </button>
            </div>
            <div>
              <button onClick={getBalance} className="card">
                Get Balance
              </button>
            </div>
            <div>
              <button onClick={signMessage} className="card">
                Sign Message
              </button>
            </div>
            <div>
              <button onClick={sendTransaction} className="card">
                Send Transaction
              </button>
            </div>
            <div>
              <button onClick={logout} className="card">
                Log Out
              </button>
            </div>
          </div>
        </>
      );

      
      
      function App() {
        const [provider, setProvider] = useState<IProvider | null>(null);
        const [loggedIn, setLoggedIn] = useState(false);
      
        useEffect(() => {
          const init = async () => {
            try {
              await web3auth.initModal();
              setProvider(web3auth.provider);
      
              if (web3auth.connected) {
                setLoggedIn(true);
              }
            } catch (error) {
              console.error(error);
            }
          };
      
          init();
        }, []);

      const login = async () => {
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      };

  return (
    <div>
        <h1>Web3AuthTest</h1>
    </div>
  )
}

export default Web3AuthTest