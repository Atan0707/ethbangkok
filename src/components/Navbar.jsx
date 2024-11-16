// /* eslint-disable react/prop-types */
import Web3AuthButton from './Web3AuthButton';
import { Link } from 'react-router-dom'; 

function Navbar() {
  return (
    <nav className="bg-slate-400 flex justify-between items-center p-4 w-full top-0 left-0 z-10">
      <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
        Home
      </Link>
      <Link 
        to="/register-car" 
        className="text-gray-700 hover:text-blue-600 transition-colors"
      >
        Register Car
      </Link>
      <Link 
        to="/registered-cars" 
        className="text-gray-700 hover:text-blue-600 transition-colors"
      >
        Registered Cars
      </Link>
      <Web3AuthButton />
    </nav>
  );
}

export default Navbar;