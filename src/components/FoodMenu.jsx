import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cart from './Cart';

export default function FoodMenu() {
    const [cuisineFoods, setCuisineFoods] = useState([]);
    const [allFoods, setAllFoods] = useState([]);
    const [selectedCuisineId, setSelectedCuisineId] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCuisinesAndFoods = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/cuisines-with-food");
                const data = response.data.data || [];

                setCuisineFoods(data);

                let combinedFoods = [];
                data.forEach(cuisine => {
                    combinedFoods = combinedFoods.concat(cuisine.foods || []);
                });
                setAllFoods(combinedFoods);
                setFoods(combinedFoods);
                setSelectedCuisineId(null);

            } catch (err) {
                console.error("Error fetching cuisines or foods:", err);
                toast.error("Failed to load food menu. Please check your backend configuration.");
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCuisinesAndFoods();
    }, []);


    useEffect(() => {
        const fetchCart = async () => {
            let guestCartToken = localStorage.getItem("guest_cart_token");
            if (!guestCartToken) {
                guestCartToken = "guest-" + Math.random().toString(36).substring(2, 15);
                localStorage.setItem("guest_cart_token", guestCartToken);
            }

            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/cart/guest/${guestCartToken}`);
                setCartItems(response.data.cart_items || []); // কার্ট আইটেম সেট করা হচ্ছে
            } catch (error) {
                console.error("Error fetching cart:", error);
                toast.warn("Failed to load cart items or cart is empty.");
                setCartItems([]);
            }
        };

        fetchCart();
    }, []);

    const handleFilter = (cuisineId) => {
        setSelectedCuisineId(cuisineId);

        if (cuisineId === null) {
            setFoods(allFoods);
        } else {
            const selected = cuisineFoods.find(cuisine => cuisine.id === cuisineId);
            setFoods(selected?.foods || []);
        }
    };

    const updateCartItemQuantity = async (foodId, newQuantity) => {
        let cartIdentifier = localStorage.getItem("guest_cart_token");


        const foodInAllFoods = allFoods.find(f => f.id === foodId);
        if (!foodInAllFoods) {
            toast.error("Food item not found in available menu.");
            return;
        }

        if (newQuantity > 0 && foodInAllFoods.stock_quantity < newQuantity) {
            toast.warn(`Cannot add more. Only ${foodInAllFoods.stock_quantity} in stock.`);
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/cart/guest/add",
                { food_id: foodId, quantity: newQuantity, cart_token: cartIdentifier }
            );


            setCartItems(prevItems => {
                const existingItemIndex = prevItems.findIndex(item => item.food_id === foodId);

                if (newQuantity > 0) {
                    if (existingItemIndex > -1) {
                        const newItems = [...prevItems];
                        newItems[existingItemIndex] = {
                            ...newItems[existingItemIndex],
                            quantity: newQuantity,
                            price: foodInAllFoods.discount_price,
                            item_total: newQuantity * foodInAllFoods.discount_price,
                        };
                        return newItems;
                    } else {
                        return [
                            ...prevItems,
                            {
                                food_id: foodId,
                                food_name: foodInAllFoods.name,
                                quantity: newQuantity,
                                price: foodInAllFoods.discount_price,
                                image: foodInAllFoods.image,
                                item_total: newQuantity * foodInAllFoods.discount_price,
                            }
                        ];
                    }
                } else {
                    return prevItems.filter(item => item.food_id !== foodId);
                }
            });

            toast.success(response.data.message || "Cart updated successfully!");

        } catch (error) {
            console.error("Error updating cart:", error);
            const msg = error.response?.data?.message || "Failed to update cart. Please try again.";
            toast.error(msg);
        }
    };


    const calculateSellPrice = (food) => {
        const base = parseFloat(food.discount_price);
        const vat = parseFloat(food.vat_percentage);
        if (isNaN(base) || isNaN(vat)) {
            return "N/A";
        }
        return (base + (base * vat) / 100).toFixed(2);
    };


    const getFoodQuantityInCart = (foodId) => {
        const item = cartItems.find(item => item.food_id === foodId);
        return item ? item.quantity : 0;
    };

    const increaseQuantity = (foodId) => {
        const currentQty = getFoodQuantityInCart(foodId);
        updateCartItemQuantity(foodId, currentQty + 1);
    };


    const decreaseQuantity = (foodId) => {
        const currentQty = getFoodQuantityInCart(foodId);
        updateCartItemQuantity(foodId, currentQty - 1);
    };


    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-700">Loading food menu...</p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="text-center p-20 border border-gray-300">
                Something went wrong. Please refresh the page.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans flex flex-col sm:flex-row">

            <div className="flex-1 overflow-auto pr-0 sm:pr-6 mb-6 sm:mb-0">
                <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
                    <h1 className="text-3xl font-bold text-gray-800"> Our Food Menu</h1>
                </header>


                <div className="flex flex-wrap gap-3 mb-6 justify-center bg-white p-4 rounded-lg shadow">
                    <button
                        onClick={() => handleFilter(null)}
                        className={`px-4 py-2 rounded-full text-sm border transition duration-200 ease-in-out
                                ${selectedCuisineId === null
                                ? "bg-black text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                            }`}
                    >
                        All Foods
                    </button>
                    {cuisineFoods.map((cuisine) => (
                        <button
                            key={cuisine.id}
                            onClick={() => handleFilter(cuisine.id)}
                            className={`px-4 py-2 rounded-full text-sm border transition duration-200 ease-in-out
                                ${selectedCuisineId === cuisine.id
                                    ? "bg-black text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                                }`}
                        >
                            {cuisine.name}
                        </button>
                    ))}
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {foods.length > 0 ? (
                        foods.map((food) => (
                            <div
                                key={food.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg transform hover:-translate-y-1"
                            >
                                <img
                                    src={`http://127.0.0.1:8000/${food.image}`}
                                    alt={food.name}
                                    className="w-full h-40 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/400x200/cccccc/333333?text=No+Image";
                                    }}
                                />

                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-1">{food.name}</h2>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {food.description || "No description available."}
                                    </p>
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <span className="text-green-600 font-bold text-lg">
                                                ${calculateSellPrice(food)}
                                            </span>
                                            {parseFloat(food.discount_price) < parseFloat(food.price) && (
                                                <span className="line-through ml-2 text-gray-400 text-sm">
                                                    ${food.price}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            VAT: {food.vat_percentage}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Cuisine: {food.cuisine_name || "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Stock: <span className="font-medium text-gray-700">{food.stock_quantity}</span>
                                    </p>

                                    <div className="flex justify-center items-center gap-4">
                                        <button
                                            onClick={() => decreaseQuantity(food.id)}
                                            disabled={getFoodQuantityInCart(food.id) === 0}
                                            className="px-3 py-1 border rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out bg-gray-200 hover:bg-gray-300 text-gray-700"
                                        >
                                            -
                                        </button>

                                        <span className="w-8 text-center font-semibold text-gray-800 text-lg">
                                            {getFoodQuantityInCart(food.id)}
                                        </span>

                                        <button
                                            onClick={() => increaseQuantity(food.id)}
                                            disabled={food.stock_quantity <= getFoodQuantityInCart(food.id)}
                                            className="px-3 py-1 border rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full py-10">
                            No food items available for this cuisine.
                        </p>
                    )}
                </div>
            </div>

            <Cart cartItems={cartItems} calculateCartTotal={calculateCartTotal} />

            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200 z-10">
                {cartItems.length > 0 ? (
                    <Link
                        to="/checkout"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-center flex items-center justify-between"
                    >
                        <span> View Your Cart ({cartItems.length} items)</span>
                        <span>${calculateCartTotal()}</span>
                    </Link>
                ) : (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                )}
            </div>
        </div>
    );
}