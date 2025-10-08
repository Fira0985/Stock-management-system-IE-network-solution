import React, { useState, useEffect } from 'react';
import { addSale } from '../../services/saleService';
import './saleForm.css';

// Toast component with dynamic color
const Toast = ({ message, type = 'error', onClose }) => (
    <div
        style={{
            position: 'fixed',
            top: 30,
            right: 30,
            background: type === 'success' ? '#38a169' : '#e53e3e', // green for success, red for error
            color: '#fff',
            padding: '14px 24px',
            borderRadius: 8,
            zIndex: 9999,
            fontWeight: 500,
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            minWidth: 200,
            cursor: 'pointer',
        }}
        onClick={onClose}
    >
        {message}
    </div>
);

const NewSaleForm = ({ products, customers, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        type: 'CASH',
        customer_id: '',
        items: [{ product_id: '', quantity: 1, sale_price: 0 }],
        total: 0,
        discount_amount: 0,
        paid_amount: 0,
        balance_due: 0,
        due_date: '',
    });
    const [toast, setToast] = useState(null);

    const recalc = (items, discount_amount, paid_amount) => {
        const total = items.reduce(
            (sum, { quantity, sale_price }) => sum + quantity * sale_price,
            0
        );
        return {
            total,
            balance_due: Math.max(0, total - discount_amount - paid_amount),
        };
    };

    const updateFormChange = (updates) => {
        let newForm = { ...form, ...updates };
        const recalculated = recalc(
            newForm.items,
            newForm.discount_amount,
            newForm.paid_amount
        );

        if (newForm.type === 'CASH') {
            newForm.paid_amount = recalculated.total;
            newForm.balance_due = 0;
        } else {
            if (newForm.paid_amount > recalculated.total)
                newForm.paid_amount = recalculated.total;
            if (newForm.paid_amount < 0) newForm.paid_amount = 0;
            newForm.balance_due =
                recalculated.total - newForm.discount_amount - newForm.paid_amount;
        }

        setForm({ ...newForm, total: recalculated.total });
    };

    useEffect(() => {
        const recalculated = recalc(form.items, form.discount_amount, form.paid_amount);
        setForm((f) => ({
            ...f,
            ...recalculated,
            paid_amount: f.type === 'CASH' ? recalculated.total : f.paid_amount,
        }));
    }, [form.items.length]);

    const handleItemChange = (index, field, value) => {
        const items = [...form.items];
        if (field === 'quantity') {
            items[index][field] = Math.max(1, parseInt(value) || 1);
        } else if (field === 'sale_price') {
            items[index][field] = parseFloat(value) || 0;
        } else {
            items[index][field] = value;
        }
        updateFormChange({ items });
    };

    const handleProductSelect = (index, productId) => {
        const selectedProduct = products.find(
            (p) => p.id.toString() === productId
        );
        const sale_price = selectedProduct ? selectedProduct.sale_price || 0 : 0;

        const items = [...form.items];
        items[index] = {
            ...items[index],
            product_id: productId,
            sale_price,
        };
        updateFormChange({ items });
    };

    const addNewItem = () => {
        updateFormChange({
            items: [...form.items, { product_id: '', quantity: 1, sale_price: 0 }],
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (form.items.some((i) => !i.product_id || i.quantity <= 0)) {
            setToast({ message: 'Please select valid products and quantities.', type: 'error' });
            return;
        }
        if (form.type === 'CREDIT' && !form.customer_id) {
            setToast({ message: 'Customer is required for credit sales.', type: 'error' });
            return;
        }

        try {
            await addSale({
                ...form,
                customer_id: form.customer_id || null,
                due_date: form.due_date || null,
            });
            setToast({
                message:
                    form.type === 'CASH'
                        ? 'Cash sale recorded successfully!'
                        : 'Credit sale recorded successfully!',
                type: 'success',
            });
            onSuccess();
            setTimeout(onClose, 2000); // Auto-close after 2s
        } catch (err) {
            setToast({
                message: err?.response?.data?.message || 'Failed to add sale. Please try again.',
                type: 'error',
            });
        }
    };

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    return (
        <div className="modal-backdrop">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <form
                className="sale-form"
                onSubmit={submit}
                style={{ position: 'relative', width: '500px' }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        color: '#333',
                        lineHeight: 1,
                    }}
                >
                    &times;
                </button>

                <h2 style={{ marginTop: 0 }}>New Sale</h2>

                {/* Type */}
                <label htmlFor="sale-type">Sale Type:</label>
                <select
                    id="sale-type"
                    value={form.type}
                    onChange={(e) => updateFormChange({ type: e.target.value })}
                >
                    <option value="CASH">Cash</option>
                    <option value="CREDIT">Credit</option>
                </select>

                {/* Customer */}
                <label htmlFor="customer">Customer:</label>
                <select
                    id="customer"
                    value={form.customer_id}
                    onChange={(e) => updateFormChange({ customer_id: e.target.value })}
                    required={form.type === 'CREDIT'}
                    disabled={form.type !== 'CREDIT' && customers.length === 0}
                >
                    <option value="" disabled={form.type === 'CREDIT'}>
                        -- None --
                    </option>
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                {/* Items */}
                <label>Sale Items:</label>
                {form.items.map((item, idx) => (
                    <div className="item-row" key={idx}>
                        <select
                            required
                            value={item.product_id}
                            onChange={(e) => handleProductSelect(idx, e.target.value)}
                        >
                            <option value="">-- Select Product --</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Qty"
                            min="1"
                            required
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Unit Price"
                            min="0"
                            step="0.01"
                            required
                            value={item.sale_price}
                            onChange={(e) => handleItemChange(idx, 'sale_price', e.target.value)}
                            readOnly
                        />
                    </div>
                ))}
                <button type="button" onClick={addNewItem}>
                    + Add Item
                </button>

                {/* Paid */}
                <label htmlFor="paid-amount">Paid Amount:</label>
                <input
                    id="paid-amount"
                    type="number"
                    min="0"
                    max={form.total}
                    step="0.01"
                    value={form.paid_amount}
                    onChange={(e) => {
                        if (form.type === 'CREDIT') {
                            let val = parseFloat(e.target.value) || 0;
                            if (val > form.total) val = form.total;
                            if (val < 0) val = 0;
                            updateFormChange({ paid_amount: val });
                        }
                    }}
                    readOnly={form.type === 'CASH'}
                    disabled={form.type === 'CASH'}
                />

                {form.type === 'CREDIT' && (
                    <>
                        <label htmlFor="due-date">Due Date:</label>
                        <input
                            id="due-date"
                            type="date"
                            value={form.due_date}
                            onChange={(e) => updateFormChange({ due_date: e.target.value })}
                            required={form.type === 'CREDIT'}
                        />
                    </>
                )}

                <p>
                    <strong>Total:</strong> ${form.total.toFixed(2)}
                </p>
                <p>
                    <strong>Balance Due:</strong> ${form.balance_due.toFixed(2)}
                </p>

                <div className="sale-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewSaleForm;
