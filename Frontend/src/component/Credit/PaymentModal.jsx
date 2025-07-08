import React, { useState } from "react";
import "./paymentModal.css";

const PaymentModal = ({ sale, onClose, onSubmit }) => {
    const [amount, setAmount] = useState("");

    const handleSubmit = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount > sale.balance_due) {
            alert("Invalid amount");
            return;
        }
        onSubmit(sale.id, numericAmount);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Make Payment for {sale.saleId}</h2>
                <p>Customer: {sale.customer}</p>
                <p>Balance Due: ${sale.balance_due.toFixed(2)}</p>

                <input
                    type="number"
                    placeholder="Enter payment amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="modal-input"
                />

                <div className="modal-buttons">
                    <button onClick={handleSubmit} className="submit-button">Pay</button>
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
