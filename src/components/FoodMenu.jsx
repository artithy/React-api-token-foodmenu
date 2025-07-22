import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cart from '../components/Cart';
import Drawer from '../components/Drawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function FoodMenu() {
    const [cuisineFoods, setCuisineFoods] = useState([]);
    const [allFoods, setAllFoods] = useState([]);
    const [selectedCuisineId, setSelectedCuisineId] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
                toast.error("Failed to load food menu.");
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
                setCartItems(response.data.cart_items || []);
            } catch (error) {
                toast.warn("Failed to load cart.");
                setCartItems([]);
            }
        };

        fetchCart();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0 && !isDrawerOpen) {
            setIsDrawerOpen(true);
        } else if (cartItems.length === 0) {
            setIsDrawerOpen(false);
        }
    }, [cartItems]);


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
        if (!foodInAllFoods) return toast.error("Food item not found.");

        if (newQuantity > 0 && foodInAllFoods.stock_quantity < newQuantity) {
            return toast.warn(`Only ${foodInAllFoods.stock_quantity} in stock.`);
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

            toast.success(response.data.message || "Cart updated!");

        } catch (error) {
            console.error("Error updating cart:", error);
            toast.error("Failed to update cart.");
        }
    };

    const calculateSellPrice = (food) => {
        const base = parseFloat(food.discount_price);
        const vat = parseFloat(food.vat_percentage);
        if (isNaN(base) || isNaN(vat)) return "N/A";
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

    const getFoodGridStyle = () => {
        const gap = '1rem';
        let numColumns = 4;

        if (window.innerWidth < 640) {
            numColumns = 1;
        } else if (window.innerWidth < 768) {
            numColumns = 2;
        } else if (window.innerWidth < 1024) {
            numColumns = 3;
        } else {
            numColumns = 4;
        }

        return {
            gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`,
            gap: gap,
        };
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
        <div className="h-screen flex flex-col bg-gray-50 font-sans">
            <header className="w-full bg-white p-4 shadow flex justify-between items-center z-40">
                <h1 className="text-3xl font-bold text-gray-800">Our Food Menu</h1>
                <button
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center shadow-md transition duration-200"
                >
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    <span className="hidden sm:inline">{isDrawerOpen ? 'Hide Cart' : 'View Cart'}</span>
                    <span className="ml-2 px-2 py-1 bg-white text-purple-800 rounded-full text-sm font-semibold">
                        ${calculateCartTotal()}
                    </span>
                </button>
            </header>


            <div className="w-full bg-white p-4 shadow flex flex-wrap gap-3 justify-center z-30">
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


            <div className="flex flex-grow overflow-hidden">

                <div
                    className={`flex-grow p-6 overflow-y-auto ${isDrawerOpen ? 'lg:w-3/4' : 'w-full'}`}
                >
                    <div
                        className="grid transition-all duration-300"
                        style={getFoodGridStyle()}
                    >
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


                {isDrawerOpen && (
                    <div className="relative w-80 lg:w-96 flex-shrink-0 p-6">
                        <Drawer
                            isOpen={isDrawerOpen}
                            onClose={() => setIsDrawerOpen(false)}
                            cartItemsCount={cartItems.length}
                        >
                            <Cart
                                cartItems={cartItems}
                                calculateCartTotal={calculateCartTotal}
                                updateCartItemQuantity={updateCartItemQuantity}
                                navigate={navigate}
                                setIsDrawerOpen={setIsDrawerOpen}
                            />
                        </Drawer>
                    </div>
                )}
            </div>
        </div>
    );
}