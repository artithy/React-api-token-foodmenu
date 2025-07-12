import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function Registration() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [generalError, setGeneralError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();


        setEmailError("");
        setGeneralError("");

        if (!name || !email || !password) {
            setGeneralError("Please fill all fields.");
            return;
        }

        if (password.length < 6) {
            setGeneralError("Password must be at least 6 characters long.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setEmailError("Please enter a valid email.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/register", {
                user_name: name, email, password,
            });
            console.log(response.data);
            alert(response.data.message);
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;

                if (errorMessage.includes("already exist") || errorMessage.includes("duplicate entry for email")) {
                    setEmailError(errorMessage);
                } else {
                    setGeneralError(errorMessage);
                }
            } else {
                setGeneralError('Register failed. please try again');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
                    Create an Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                    />


                    <div>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError("");
                            }}
                            className={`w-full px-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${emailError ? 'focus:ring-red-400' : 'focus:ring-purple-400'}`}
                            required
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm mt-1">{emailError}</p>
                        )}
                    </div>


                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        required
                    />

                    {generalError && (
                        <p className="text-red-500 text-sm text-center">{generalError}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-300"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    Already registered?{" "}
                    <Link to="/login" className="text-purple-600 hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}