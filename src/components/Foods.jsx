import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";

export default function Foods() {
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8000/api/food", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });


                console.log("Foods fetched:", response.data);

                setFoods(response.data.food || []);
            } catch (error) {
                console.error("Failed to fetch foods:", error);
                alert("Failed to load food items.");
            }
        };

        fetchFoods();
    }, []);

    return (
        <>
            <h2>Food List</h2>
            <table >
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Cuisine</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>VAT %</th>
                        <th>Selling Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Created</th>
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
                                <td>
                                    {food.image ? (
                                        <img
                                            src={`http://127.0.0.1:8000/${food.image}`}
                                            alt="food"
                                            width="50"
                                            height="50"
                                        />
                                    ) : "No image"}
                                </td>
                                <td>{food.name}</td>
                                <td>{food.description || "N/A"}</td>
                                <td>{food.cuisine_name || "Unknown"}</td>
                                <td>${food.price}</td>
                                <td>${food.discount_price}</td>
                                <td>{food.vat_percentage}%</td>
                                <td>${sellingPrice}</td>
                                <td>{food.stock_quantity}</td>
                                <td>{food.status}</td>
                                <td>{moment(food.created_at).format("YYYY-MM-DD")}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
