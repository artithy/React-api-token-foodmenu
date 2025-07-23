import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

export default function OrderConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const { orderId, customerDetails, orderItems, finalTotal } = location.state || {};

    useEffect(() => {
        // যদি orderId না থাকে (যেমন কেউ সরাসরি /place-order এ চলে আসে),
        // তাহলে একটি মেসেজ দেখিয়ে মেনুতে পাঠিয়ে দিন।
        if (!orderId) {
            toast.info("No order details found. Redirecting to menu.");
            navigate('/menu', { replace: true });
        } else {
            // অর্ডার সফল হলে guest_cart_token সরিয়ে দিন
            localStorage.removeItem("guest_cart_token");
        }
    }, [orderId, navigate]); // orderId এবং navigate dependencies হিসেবে

    // যদি orderId না থাকে, তাহলে একটি সিম্পল লোডিং বা রিডাইরেকশন মেসেজ দেখান
    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-700">Redirecting to menu...</p>
            </div>
        );
    }

    // অর্ডার নিশ্চিত হলে এই অংশটি রেন্ডার হবে
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-2xl text-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl mb-6 animate-bounce" />
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
                <p className="text-lg text-gray-600 mb-8">Thank you for your order. Your food is being prepared.</p>

                <section className="mb-8 p-4 bg-gray-50 rounded-md border border-gray-200 text-left">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Order Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p className="font-medium">Order ID:</p>
                            <p className="text-lg font-bold text-blue-600">{orderId}</p>
                        </div>
                        <div>
                            <p className="font-medium">Total Amount:</p>
                            {/* parseFloat দিয়ে নিশ্চিত করা হয়েছে যাতে সংখ্যা হিসেবে বিবেচিত হয় */}
                            <p className="text-lg font-bold text-green-600">${parseFloat(finalTotal).toFixed(2)}</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <p className="font-medium">Customer Name:</p>
                            <p>{customerDetails.name}</p> {/* ধরে নেওয়া হয়েছে customerDetails.name সবসময় থাকবে */}
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <p className="font-medium">Delivery Address:</p>
                            <p>{customerDetails.address}</p> {/* ধরে নেওয়া হয়েছে customerDetails.address সবসময় থাকবে */}
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <p className="font-medium">Phone Number:</p>
                            <p>{customerDetails.phone}</p> {/* ধরে নেওয়া হয়েছে customerDetails.phone সবসময় থাকবে */}
                        </div>
                        {customerDetails.orderNotes && ( // যদি orderNotes থাকে তবেই দেখাও
                            <div className="col-span-1 md:col-span-2">
                                <p className="font-medium">Order Notes:</p>
                                <p className="italic text-sm">{customerDetails.orderNotes}</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="mb-8 p-4 bg-gray-50 rounded-md border border-gray-200 text-left">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Items Ordered</h2>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                        {orderItems && orderItems.map((item) => ( // orderItems আছে কিনা চেক করা হয়েছে
                            <div key={item.food_id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                                <div className="flex items-center space-x-3 flex-grow">
                                    <img
                                        src={`http://127.0.0.1:8000/${item.image}`}
                                        alt={item.food_name}
                                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/48x48/cccccc/333333?text=No+Img";
                                        }}
                                    />
                                    <div className="flex-grow">
                                        <p className="text-md font-medium text-gray-800 line-clamp-1">{item.food_name}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-blue-600 text-md flex-shrink-0 ml-4">
                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <button
                    onClick={() => navigate('/menu')}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
}