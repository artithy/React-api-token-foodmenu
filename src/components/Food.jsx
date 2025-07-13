import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Food() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount_price, setDiscountPrice] = useState("");
    const [vat_percentage, setVatPercentage] = useState("");
    const [stock_quantity, setStockQuantity] = useState("");
    const [imageBase64, setImageBase64] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("active");
    const [cuisine_id, setCuisineId] = useState("");
    const [cuisines, setCuisines] = useState([]);

    useEffect(() => {
        const fetchCuisines = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8000/api/cuisin", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCuisines(response.data.cuisine);
            } catch (error) {
                console.error("Failed to fetch cuisines:", error);
            }
        };

        fetchCuisines();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !price || !discount_price || !vat_percentage || !stock_quantity || !cuisine_id || !imageBase64) {
            alert("Please fill all required fields.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token || token.length < 64) {
            alert("Please login first.");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/food",
                {
                    name,
                    description,
                    price,
                    discount_price,
                    vat_percentage,
                    stock_quantity,
                    cuisine_id,
                    date,
                    status,
                    image: imageBase64,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message);

            if (response.data.food) {
                setName("");
                setDescription("");
                setPrice("");
                setDiscountPrice("");
                setVatPercentage("");
                setStockQuantity("");
                setCuisineId("");
                setDate("");
                setImageBase64("");
            }
        } catch (error) {
            console.error("Error while adding food:", error);
            alert("Food creation failed.");
        }
    };

    return (
        <>
            <h2>Add Food</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Food Name" value={name} onChange={(e) => setName(e.target.value)} />
                <br />

                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <br />

                <select value={cuisine_id} onChange={(e) => setCuisineId(e.target.value)}>
                    <option value="">Select Cuisine</option>
                    {cuisines.map((cuisine) => (
                        <option key={cuisine.id} value={cuisine.id}>{cuisine.name}</option>
                    ))}
                </select>
                <br />

                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                <br />

                <input type="number" placeholder="Discount Price" value={discount_price} onChange={(e) => setDiscountPrice(e.target.value)} />
                <br />

                <input type="number" placeholder="VAT Percentage" value={vat_percentage} onChange={(e) => setVatPercentage(e.target.value)} />
                <br />

                <input type="number" placeholder="Stock Quantity" value={stock_quantity} onChange={(e) => setStockQuantity(e.target.value)} />
                <br />

                <input type="file" name="image" onChange={handleImageChange} />
                <br />

                <input type="text" placeholder="Date (optional)" value={date} onChange={(e) => setDate(e.target.value)} />
                <br />

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <br />

                <button type="submit">Add Food</button>
            </form>
        </>
    );
}
