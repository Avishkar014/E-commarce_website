import React, { useState, useEffect, useMemo } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    old_price: "",
    new_price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Use Vite env or fallback
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // ✅ Live image preview
  const imagePreview = useMemo(() => {
    return image ? URL.createObjectURL(image) : upload_area;
  }, [image]);

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(imagePreview);
    };
  }, [image, imagePreview]);

  const imageHandler = (e) => setImage(e.target.files[0]);

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const parseJSON = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const Add_Product = async () => {
    if (!image || !productDetails.name || !productDetails.old_price || !productDetails.new_price) {
      alert("⚠️ Please fill all fields and select an image.");
      return;
    }

    setLoading(true);
    setError(null);

    let product = { ...productDetails };

    try {
      // ✅ Step 1: Upload image
      const formData = new FormData();
      formData.append("product", image);

      const uploadRes = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error(`Image upload failed (${uploadRes.status})`);
      const uploadData = await parseJSON(uploadRes);

      if (!uploadData || !uploadData.success) {
        throw new Error("Image upload failed.");
      }

      product.image = uploadData.image_url;

      // ✅ Step 2: Add product
      const productRes = await fetch(`${API_BASE}/addproduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!productRes.ok) throw new Error(`Add product failed (${productRes.status})`);
      const productData = await parseJSON(productRes);

      if (productData && productData.success) {
        alert("✅ Product added successfully!");
        setProductDetails({
          name: "",
          image: "",
          category: "women",
          old_price: "",
          new_price: "",
        });
        setImage(null);
      } else {
        throw new Error("Failed to add product. Try again.");
      }
    } catch (err) {
      console.error("❌ Add product error:", err);
      setError(err.message || "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product">
      {error && <p className="error-message">{error}</p>}

      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="number"
            name="old_price"
            placeholder="Enter price"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="number"
            name="new_price"
            placeholder="Enter offer price"
          />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={imagePreview} alt="Upload Preview" />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>

      <button onClick={Add_Product} className="addproduct-btn" disabled={loading}>
        {loading ? "Adding..." : "ADD"}
      </button>
    </div>
  );
};

export default AddProduct;
