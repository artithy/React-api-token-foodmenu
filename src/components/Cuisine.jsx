import React, { useState } from "react";
import axios from "axios";

export default function Cuisine() {
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first.");
            return;
        }

        if (!name) {
            alert("Please enter a cuisine name.");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/cuisin",
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message);
            setName("");
        } catch (error) {
            console.error("Error adding cuisine:", error);
            alert("Cuisine creation failed.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🍜 Add New Cuisine</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Cuisine Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                    ➕ Add Cuisine
                </button>
            </form>
        </div>
    );
}
