import { useState } from 'react';
// import './App.css';
import Navbar from './components/Navbar';
import LED from './components/LED';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewCars from './pages/ViewCars'
import RegisterCar from './pages/RegisterCar'
import CarDetails from './pages/CarDetails'
import Web3AuthTest from './pages/Web3AuthTest';
import { Web3AuthProvider } from './context/Web3AuthContext';
import Home from './pages/Home';

function App() {
  return (
    <Web3AuthProvider>
      <Router>
        <div className="App bg-slate-300 min-h-screen">
          {/* <div className="navbar sticky top-0 z-50"> */}
            {/* <Navbar /> */}
          {/* </div> */}
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registered-cars" element={<ViewCars />} />
            <Route path="/register-car" element={<RegisterCar />} />
            <Route path="/car-details/:plateNumber" element={<CarDetails />} />
            <Route path='/web3auth' element={<Web3AuthTest />} />
          </Routes>
        </div>
      </Router>
    </Web3AuthProvider>
  );
}

export default App;