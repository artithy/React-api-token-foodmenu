import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Food from './Food';


export default function Dashboard() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function fetchUserData() {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found, redirecting to login.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.get("http://127.0.0.1:8000/api/dashboard", {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            setEmail(response.data.user.email);
        } catch (error) {
            console.error("Error fetching user data:", error);
            if (error.response && error.response.status === 401) {

                alert("Session expired or unauthorized. Please login again.");
            } else {

                alert("Failed to fetch user data. Please try again.");
            }
            localStorage.removeItem("token");
            navigate("/login");
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {

            await axios.post("http://127.0.0.1:8000/api/logout", {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Logout failed, please try again.");
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-purple-700 mb-4">Welcome to Dashboard</h2>
                <p className="text-gray-700 text-lg mb-6">You are logged in as <span className="font-semibold text-blue-600">{email || "Loading..."}</span></p>
                <Food />



                <button
                    onClick={handleLogout}
                    className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition duration-300 shadow-md"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}