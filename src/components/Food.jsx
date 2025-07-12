import React, { useEffect, useState } from "react";
import axios from "axios";
import imageToBase64 from "image-to-base64";

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
    const [cuisineLoaded, setCuisineLoaded] = useState(false);

    useEffect(() => {
        console.log(imageBase64);
    }, [imageBase64])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !price || !discount_price || !vat_percentage || !stock_quantity || !cuisine_id) {
            alert("Please fill all required fields.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token || token.length < 64) {
            alert("Please login first.");
            return;
        }

        axios.post(
            "http://127.0.0.1:8000/api/food",
            {
                name,
                description,
                price,
                discount_price,
                vat_percentage,
                stock_quantity,
                cuisine_id,
                status,
                date,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then(function name(response) {
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
            }
        }).catch(function (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert("Unauthorized or expired session. Please log in again.");
                localStorage.removeItem("token");
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Food creation failed. Please try again.");
            }
        })

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
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert("Unauthorized or expired session. Please log in again.");
                localStorage.removeItem("token");
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Food creation failed. Please try again.");
            }
        }
    };


    useEffect(() => {
        const fetchCuisines = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8000/api/cuisin", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCuisines(response.data.cuisine);
                setCuisineLoaded(true);
            } catch (error) {
                console.error("Failed to fetch cuisines:", error);
            }
        };

        if (!cuisineLoaded) {
            fetchCuisines();
        }

        return () => { };
    }, [cuisineLoaded]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const result = reader.result;
                setImageBase64(result);
            };

            reader.readAsDataURL(file);
        }
    };


    return (
        <>
            <h2>Add Food</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Food Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br />

                <select
                    placeholder="Cuisine"
                    defaultValue={cuisine_id}
                    onChange={(e) => setCuisineId(e.target.value)}
                >
                    <option value="">Select Cuisine</option>
                    {cuisines.map((cuisine) => (
                        <option key={cuisine.id} value={cuisine.id}>
                            {cuisine.name}
                        </option>
                    ))}
                </select>
                <br />

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />
                <br />

                <input
                    type="number"
                    placeholder="Discount Price"
                    value={discount_price}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                />
                <br />

                <input
                    type="number"
                    placeholder="VAT Percentage"
                    value={vat_percentage}
                    onChange={(e) => setVatPercentage(Number(e.target.value))}
                />
                <br />

                <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={stock_quantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                />
                <br />

                <input type="file" name="image" onChange={handleImageChange} />
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
