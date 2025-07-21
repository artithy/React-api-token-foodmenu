import React from 'react';
import { Link } from 'react-router-dom';


export default function Cart({ cartItems, calculateCartTotal }) {
    return (
        <div className="hidden sm:block w-full sm:w-80 lg:w-96 bg-white rounded-lg shadow-lg p-4 sticky top-6 self-start max-h-[calc(100vh-48px)] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                Your Cart
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {cartItems.length} items
                </span>
            </h2>
            {cartItems.length > 0 ? (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.food_id} className="flex items-center space-x-3 border-b pb-3 last:border-b-0">
                            <img
                                src={`http://127.0.0.1:8000/${item.image}`}
                                alt={item.food_name}
                                className="w-16 h-16 object-cover rounded"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64?text=No+Image`; }}
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{item.food_name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <span className="font-bold text-green-600">${item.item_total ? parseFloat(item.item_total).toFixed(2) : (item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between font-bold text-lg text-gray-900">
                            <span>Total:</span>
                            <span>${calculateCartTotal()}</span>
                        </div>

                        <Link
                            to="/checkout"
                            className="mt-4 w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center">Your cart is empty.</p>
            )}
        </div>
    );
}

