import './App.css';
import React from 'react';
import Registered from "./components/Registration";
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Food from './components/Food';
import Cuisine from './components/Cuisine';
import Foods from './components/Foods';
import FoodMenu from './components/FoodMenu';
import OrderPage from './components/OrderPage';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  // const notify = () => toast("Wow so easy!");

  return (

    <>
      {/* <button onClick={notify}>ssss</button> */}
      <Routes>
        <Route path="/" element={<Registered />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-food" element={<Food />} />
        <Route path="/add-cuisine" element={<Cuisine />} />
        <Route path="/all-foods" element={<Foods />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/order" element={<OrderPage />} />






        <Route path="/menu" element={<FoodMenu />} />

      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;