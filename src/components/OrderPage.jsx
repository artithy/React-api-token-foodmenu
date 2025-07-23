import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function OrderPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, total } = location.state || { cartItems: [], total: "0.00" };

    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        address: '',
        phone: '',
        orderNotes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            toast.info("Your cart is empty. Please add items before checking out.");
            navigate('/menu');
        }
    }, [cartItems, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!customerDetails.name || !customerDetails.address || !customerDetails.phone) {
            toast.error("Please fill in all required delivery details.");
            setIsSubmitting(false);
            return;
        }

        const orderData = {
            guest_cart_token: localStorage.getItem("guest_cart_token"),
            customer_name: customerDetails.name,
            delivery_address: customerDetails.address,
            phone_number: customerDetails.phone,
            order_notes: customerDetails.orderNotes,
            // Make sure to include food_name and image for the order_details snapshot
            items: cartItems.map(item => ({
                food_id: item.food_id,
                food_name: item.food_name, // <-- Added this
                quantity: item.quantity,
                price_at_order: item.price,
                image: item.image, // <-- Added this
            })),
            total_amount: total,
            payment_method: 'Cash on Delivery',
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/place-order", orderData);

            if (response.data.success) {
                toast.success(response.data.message || "Order placed successfully!");
                localStorage.removeItem("guest_cart_token");
                navigate('/place-order', {
                    state: {
                        orderId: response.data.order_id,
                        customerDetails: customerDetails,
                        orderItems: cartItems, // Still sending cartItems as current order items
                        finalTotal: total
                    }
                });
            } else {
                toast.error(response.data.message || "Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                let errorMessage = "Validation errors: \n";
                for (const key in errors) {
                    errorMessage += `${errors[key].join(', ')}\n`;
                }
                toast.error(errorMessage);
            } else {
                toast.error("An error occurred while placing your order.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-700">Redirecting to menu...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans">
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Review Your Order</h1>


                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Your Items</h2>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                        {cartItems.map((item) => (
                            <div key={item.food_id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
                                <div className="flex items-center space-x-3 flex-grow">
                                    <img
                                        src={`http://127.0.0.1:8000/${item.image}`}
                                        alt={item.food_name}
                                        className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/56x56/cccccc/333333?text=No+Img";
                                        }}
                                    />
                                    <div className="flex-grow">
                                        <p className="text-md font-medium text-gray-800 line-clamp-1">{item.food_name}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-blue-600 text-lg flex-shrink-0 ml-4">
                                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 mt-4 flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-800">Total:</span>
                        <span className="text-3xl font-bold text-blue-700">${total}</span>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Delivery Details</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={customerDetails.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address <span className="text-red-500">*</span></label>
                            <textarea
                                id="address"
                                name="address"
                                value={customerDetails.address}
                                onChange={handleChange}
                                rows="3"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., House 12, Road 3, Sector 4, Mirpur DOHS"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={customerDetails.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., +8801XXXXXXXXX"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                            <textarea
                                id="orderNotes"
                                name="orderNotes"
                                value={customerDetails.orderNotes}
                                onChange={handleChange}
                                rows="2"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="e.g., Please knock loudly, I can't hear well."
                            ></textarea>
                        </div>
                    </form>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Payment Method</h2>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cashOnDelivery"
                                checked={true}
                                readOnly
                                className="form-radio h-5 w-5 text-blue-600"
                            />
                            <span className="ml-3 text-lg text-gray-800 font-medium">Cash on Delivery</span>
                        </label>
                    </div>
                </section>


                <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || !cartItems || cartItems.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
}