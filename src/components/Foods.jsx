
import axios from "axios";
import { useEffect, useState } from "react";

export default function Foods() {
    const [foods, setFoods] = useState([]);

    const fetchFoods = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://127.0.0.1:8000/api/food", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            console.log("API response:", response.data);

            setFoods(response.data.foods || []);
        } catch (error) {
            console.error("Failed to fetch foods:", error);
            alert("Failed to load food items.");
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    return (
        <>
            <h2>Food List</h2>
            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Food ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Cuisine</th>
                        <th>Price</th>
                        <th>Discount Price</th>
                        <th>VAT (%)</th>
                        <th>Selling Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((food) => {
                        const sellingPrice = (
                            parseFloat(food.discount_price) +
                            (parseFloat(food.discount_price) * parseFloat(food.vat_percentage)) / 100
                        ).toFixed(2);

                        return (
                            <tr key={food.id}>
                                <td>{food.id}</td>
                                <td>{food.name}</td>
                                <td>{food.description || "N/A"}</td>
                                <td>{food.cuisine?.name || "Unknown"}</td>
                                <td>${food.price}</td>
                                <td>${food.discount_price}</td>
                                <td>{food.vat_percentage}%</td>
                                <td>${sellingPrice}</td>
                                <td>{food.stock_quantity}</td>
                                <td>{food.status}</td>
                                <td>{moment(food.created_at).format("YYYY, MMDD")}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
