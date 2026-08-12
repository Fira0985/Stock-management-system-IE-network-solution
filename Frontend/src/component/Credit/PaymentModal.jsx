import React, { useState } from "react";
import "./paymentModal.css";

const PaymentModal = ({ sale, onClose, onSubmit }) => {
    const [amount, setAmount] = useState("");

    const balance = sale?.balanceDue ?? sale?.balance_due ?? 0;

    const handleSubmit = () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount > balance) {
            alert("Invalid amount");
            return;
        }
        onSubmit(sale.id, numericAmount);
    };

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal">
                <h2 className="payment-modal-title">Make Payment for {sale.saleId}</h2>
                <p>Customer: {sale.customer}</p>
                <p>Balance Due: ${Number(balance).toFixed(2)}</p>

                <input
                    type="number"
                    placeholder="Enter payment amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="payment-input"
                />

                <div className="payment-modal-actions">
                    <button onClick={handleSubmit} className="modal-btn confirm">Pay</button>
                    <button onClick={onClose} className="modal-btn cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
