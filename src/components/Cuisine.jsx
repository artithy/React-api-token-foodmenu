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
        <>
            <h2>Add New Cuisine</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Cuisine Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <button type="submit">Add Cuisine</button>
            </form>
        </>
    );
}
