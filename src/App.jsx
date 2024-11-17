// eslint-disable-next-line no-unused-vars
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ViewCars from "./pages/ViewCars";
import RegisterCar from "./pages/RegisterCar";
import CarDetails from "./pages/CarDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Web3AuthTest from "./pages/Web3AuthTest";
import { Web3AuthProvider } from "./context/Web3AuthContext";
import Home from "./pages/Home";
import Suggestions from "./pages/Suggestions";

function App() {
  return (
    <Web3AuthProvider>
      <Router>
        <div className="App bg-slate-300 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registered-cars" element={<ViewCars />} />
            <Route path="/register-car" element={<RegisterCar />} />
            <Route path="/car-details/:plateNumber" element={<CarDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/web3auth" element={<Web3AuthTest />} />
            <Route path="/suggestions" element={<Suggestions />} />
          </Routes>
        </div>
      </Router>
    </Web3AuthProvider>
  );
}

export default App;
