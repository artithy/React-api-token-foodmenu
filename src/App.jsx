// App.js
import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Registered from "./components/Registration";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Food from './components/Food';
import Cuisine from './components/Cuisine';
import Foods from './components/Foods';
import FoodMenu from './components/FoodMenu';
import OrderPage from './components/OrderPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Registered />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/add-food" element={<Food />} />
        <Route path="/dashboard/add-cuisine" element={<Cuisine />} />
        <Route path="/dashboard/all-foods" element={<Foods />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/place-order" element={<OrderConfirmationPage />} />
        <Route path="/menu" element={<FoodMenu />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
