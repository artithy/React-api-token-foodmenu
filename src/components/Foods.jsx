import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";

export default function Foods() {
    const [foods, setFoods] = useState([]);
    const [editId, setEditId] = useState(null); // kon food edit mode te ase
    const [editData, setEditData] = useState({}); // edit kora data

    const fetchFoods = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/food", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFoods(response.data.food || []);
        } catch (error) {
            console.error("Failed to fetch foods:", error);
            alert("Failed to load food items.");
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this food item?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://127.0.0.1:8000/api/food/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Deleted successfully");
            fetchFoods();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed");
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://127.0.0.1:8000/api/food/${id}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Status updated");
            fetchFoods();
        } catch (error) {
            console.error("Status change failed:", error);
            alert("Failed to update status");
        }
    };

    const startEdit = (food) => {
        setEditId(food.id);
        setEditData({
            name: food.name,
            description: food.description || "",
            price: food.price,
            discount_price: food.discount_price,
            vat_percentage: food.vat_percentage,
            stock_quantity: food.stock_quantity,
        });
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditData({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const saveEdit = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://127.0.0.1:8000/api/food/${id}`, editData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Food updated successfully");
            setEditId(null);
            setEditData({});
            fetchFoods();
        } catch (error) {
            alert("Update failed");
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🍕 Food List</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-600 text-white text-sm">
                        <tr>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Cuisine</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Discount</th>
                            <th className="px-4 py-3">VAT %</th>
                            <th className="px-4 py-3">Sell Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Edit</th>
                            <th className="px-4 py-3">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {foods.map((food, index) => {
                            const sellingPrice = (
                                parseFloat(food.discount_price) +
                                (parseFloat(food.discount_price) * parseFloat(food.vat_percentage)) / 100
                            ).toFixed(2);

                            const isEditing = editId === food.id;

                            return (
                                <tr key={food.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="px-4 py-3">
                                        {food.image ? (
                                            <img
                                                src={`http://127.0.0.1:8000/${food.image}`}
                                                alt="food"
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400">No image</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <input
                                                name="name"
                                                value={editData.name}
                                                onChange={handleChange}
                                                className="border px-2 py-1 rounded w-full text-sm"
                                            />
                                        ) : (
                                            food.name
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <input
                                                name="description"
                                                value={editData.description}
                                                onChange={handleChange}
                                                className="border px-2 py-1 rounded w-full text-sm"
                                            />
                                        ) : (
                                            food.description || "N/A"
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{food.cuisine_name || "Unknown"}</td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <input
                                                name="price"
                                                type="number"
                                                value={editData.price}
                                                onChange={handleChange}
                                                className="border px-2 py-1 rounded w-full text-sm"
                                            />
                                        ) : (
                                            `$${food.price}`
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <input
                                                name="discount_price"
                                                type="number"
                                                value={editData.discount_price}
                                                onChange={handleChange}
                                                className="border px-2 py-1 rounded w-full text-sm"
                                            />
                                        ) : (
                                            `$${food.discount_price}`
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <input
                                                name="vat_percentage"
                                                type="number"
                                                value={editData.vat_percentage}
                                                onChange={handleChange}
                                                className="border px-2 py-1 rounded w-full text-sm"
                                            />
                                        ) : (
                                            `${food.vat_percentage}%`
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-blue-600">${sellingPrice}</td>
                                    <td className="px-4 py-3">
                                        {isEditing ? (
                                            <input
                                                name="stock_quantity"
                                                type="number"
                                                value={editData.stock_quantity}
                                                onChange={handleChange}
                                                className="border px-2 py-1 rounded w-full text-sm"
                                            />
                                        ) : (
                                            food.stock_quantity
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{moment(food.created_at).format("YYYY-MM-DD")}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(food.id)}
                                            className={`px-3 py-1 rounded text-xs font-semibold uppercase ${food.status === "active"
                                                    ? "bg-green-500 hover:bg-green-600 text-white"
                                                    : "bg-red-500 hover:bg-red-600 text-white"
                                                }`}
                                        >
                                            {food.status === "active" ? "ACTIVE" : "BLOCK"}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(food.id)}
                                                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-1"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="text-xs bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                className="text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                                                onClick={() => startEdit(food)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            type="button"
                                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                            onClick={() => handleDelete(food.id)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
