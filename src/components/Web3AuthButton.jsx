import { useWeb3Auth } from '../context/Web3AuthContext';

function Web3AuthButton() {
  const { user, address, login, logout, isLoading } = useWeb3Auth();

  const shortenAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;   
  };

  if (isLoading) {
    return (
      <button className="bg-gray-500 text-white px-4 py-2 rounded" disabled>
        Loading...
      </button>
    );
  }

  return (
    <div>
      {address ? (
        <button
          onClick={logout}
          className="bg-white text-black px-4 py-2 rounded hover:shadow-lg"
        >
          {shortenAddress(address)}
        </button>
      ) : (
        <button
          onClick={login}
          className="bg-white text-black px-4 py-2 rounded hover:shadow-lg"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}

export default Web3AuthButton;