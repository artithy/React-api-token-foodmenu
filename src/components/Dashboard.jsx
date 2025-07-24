import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Food from "./Food";
import Foods from "./Foods";
import Cuisine from "./Cuisine";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Dashboard() {
    const [email, setEmail] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmail(response.data.user.email);
            } catch (err) {
                toast.error("Unauthorized. Please login again.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        try {
            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.removeItem("token");
            toast.success("Logged out!");
            navigate("/login");
        } catch (err) {
            toast.error("Logout failed.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`w-64 bg-white shadow-md p-4 border-r fixed top-0 left-0 h-full z-50
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="text-2xl font-bold text-purple-700 mb-6">Admin Panel</div>

                <nav className="space-y-3">
                    <Link to="/dashboard" className="block hover:text-purple-600">
                        Dashboard Home
                    </Link>
                    <Link to="/dashboard/add-food" className="block hover:text-purple-600">
                        Add Food
                    </Link>
                    <Link to="/dashboard/all-foods" className="block hover:text-purple-600">
                        All Foods
                    </Link>
                    <Link to="/dashboard/add-cuisine" className="block hover:text-purple-600">
                        Add Cuisine
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="mt-4 text-red-600 hover:text-red-700"
                    >
                        Logout
                    </button>
                </nav>

                <p className="text-sm text-gray-500 mt-4">Logged in as: {email}</p>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-64"> {/* ml-64 to avoid sidebar overlap */}
                {/* Mobile header */}
                <header className="md:hidden bg-white p-4 shadow flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-purple-700">Dashboard</h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-purple-100 rounded-md"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                </header>

                {/* Nested Routes Content */}
                <main className="p-6">
                    <Routes>
                        {/* index route /dashboard */}
                        <Route
                            index
                            element={<h2 className="text-2xl font-bold">Welcome, {email}!</h2>}
                        />
                        <Route path="add-food" element={<Food />} />
                        <Route path="all-foods" element={<Foods />} />
                        <Route path="add-cuisine" element={<Cuisine />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
