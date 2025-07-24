



import React from "react";
import { Routes, Route } from "react-router-dom";

import Registered from "./components/Registration";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import OrderPage from "./components/OrderPage";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import FoodMenu from "./components/FoodMenu";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Registered />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard/*" element={<Dashboard />} />

        <Route path="/order" element={<OrderPage />} />
        <Route path="/place-order" element={<OrderConfirmationPage />} />
        <Route path="/menu" element={<FoodMenu />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
