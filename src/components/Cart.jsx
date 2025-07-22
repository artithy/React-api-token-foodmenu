import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Cart({ cartItems, calculateCartTotal, updateCartItemQuantity, navigate, setIsDrawerOpen }) {

    const handleProceedToCheckout = () => {
        setIsDrawerOpen(false);
        navigate('/order', {
            state: {
                cartItems: cartItems,
                total: calculateCartTotal()
            }
        });
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 ">
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {cartItems.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p className="text-center">Your cart is empty. Add some items to see them here.</p>
                    </div>
                ) : (
                    <>
                        {cartItems.map((item) => (
                            <div key={item.food_id} className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                                <img
                                    src={`http://127.0.0.1:8000/${item.image}`}
                                    alt={item.food_name}
                                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/64x64/cccccc/333333?text=No+Img";
                                    }}
                                />
                                <div className="flex-grow">
                                    <h3 className="text-md font-semibold text-gray-800 line-clamp-2">{item.food_name}</h3>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <div className="flex items-center flex-shrink-0">
                                    <span className="font-bold text-green-600 mr-3">
                                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => updateCartItemQuantity(item.food_id, 0)}
                                        className="text-red-500 hover:text-red-700 transition duration-200"
                                        title="Remove item"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 z-20 shadow-lg flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-green-600">${calculateCartTotal()}</span>
                </div>
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleProceedToCheckout}
                    disabled={cartItems.length === 0}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}