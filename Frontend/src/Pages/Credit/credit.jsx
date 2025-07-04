import React, { useState, useEffect } from "react";
import "./credit.css";
import {
  submitCreditSale,
  getCustomers,
  getProducts,
} from "../../services/creditService";

const credit = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [creditDays, setCreditDays] = useState(30);
  const [dueDate, setDueDate] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getCustomers().then(setCustomers);
    getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + parseInt(creditDays));
    setDueDate(today.toISOString().split("T")[0]);
  }, [creditDays]);

  useEffect(() => {
    const product = products.find((p) => p.id === parseInt(selectedProduct));
    if (product) {
      setTotal(product.price * quantity);
    }
  }, [selectedProduct, quantity, products]);

  const handleSubmit = async () => {
    const sale = {
      customerId: selectedCustomer,
      productId: selectedProduct,
      quantity,
      creditTermDays: creditDays,
      dueDate,
      total,
    };

    try {
      await submitCreditSale(sale);
      alert("Credit Sale Recorded Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to record credit sale.");
    }
  };

  return (
    <div className="credit-container">
      <h2>Record Credit Sale</h2>

      <label>Customer:</label>
      <select
        value={selectedCustomer}
        onChange={(e) => setSelectedCustomer(e.target.value)}
      >
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label>Product:</label>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} - ${p.price}
          </option>
        ))}
      </select>

      <label>Quantity:</label>
      <input
        type="number"
        value={quantity}
        min="1"
        onChange={(e) => setQuantity(e.target.value)}
      />

      <label>Credit Term (Days):</label>
      <input
        type="number"
        value={creditDays}
        min="1"
        onChange={(e) => setCreditDays(e.target.value)}
      />

      <p>
        Due Date: <strong>{dueDate}</strong>
      </p>
      <p>
        Total: <strong>${total}</strong>
      </p>

      <button onClick={handleSubmit}>Submit Credit Sale</button>
    </div>
  );
};

export default credit;
