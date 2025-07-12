import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");
        setGeneralError("");

        if (!email || !password) {
            setGeneralError("Please fill all fields.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setEmailError("Please enter a valid email.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                console.log("Login successful:", response.data);
                navigate("/dashboard");
                setEmail("");
                setPassword("");
            }
            else if (response.data.message) {
                const message = response.data.message.toLowerCase();
                if (
                    message.includes("invalid credentials") ||
                    message.includes("incorrect email or password") ||
                    message.includes("user not found") ||
                    message.includes("invalid image or password")
                ) {
                    setHasError(true);
                    setPasswordError("Invalid email or password.");
                } else if (message.includes("email not verified")) {
                    setGeneralError("Please verify your email address.");
                } else {
                    setGeneralError(response.data.message);
                }
            } else {
                setGeneralError("Login response was unexpected. Please try again.");
            }

        } catch (error) {

            console.error("Login error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                const message = error.response.data.message.toLowerCase();
                if (
                    message.includes("invalid credentials") ||
                    message.includes("incorrect email or password") ||
                    message.includes("user not found") ||
                    message.includes("invalid image or password")
                ) {
                    setPasswordError("Invalid email or password.");
                } else if (message.includes("email not verified")) {
                    setGeneralError("Please verify your email address.");
                } else {
                    setGeneralError(error.response.data.message);
                }
            } else if (error.request) {
                setGeneralError("No response from server. Please check your internet connection.");
            } else {
                setGeneralError("Login failed. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {hasError &&
                        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong class="font-bold">Woops!</strong>
                            <span class="block sm:inline">{passwordError}</span>
                            <span onClick={() => setHasError(false)} class="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                            </span>
                        </div>
                    }
                    <div>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError("");
                                setPasswordError("");
                                setGeneralError("");
                            }}
                            className={`w-full px-4 py-2 border ${emailError ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 ${emailError ? "focus:ring-red-400" : "focus:ring-purple-400"
                                }`}
                            required
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm mt-1">{emailError}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError("");
                                setGeneralError("");
                            }}
                            className={`w-full px-4 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${passwordError ? 'focus:ring-red-400' : 'focus:ring-purple-400'}`}
                            required
                        />
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                        )}
                    </div>

                    {generalError && (
                        <p className="text-red-500 text-sm text-center">{generalError}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-300"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Don’t have an account?{" "}
                    <Link
                        to="/"
                        className="text-purple-600 hover:underline font-medium"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}