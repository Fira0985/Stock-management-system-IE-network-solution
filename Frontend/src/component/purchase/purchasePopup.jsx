import React, { useEffect, useState } from 'react';
import './purchasePopup.css';
import { fetchAllProducts } from '../../services/productService';
import { fetchNonUser } from '../../services/nonUserService';
import { createPurchase } from '../../services/purchaseService';

const PurchasePopup = ({ onClose }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [purchaseItems, setPurchaseItems] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productData, supplierData] = await Promise.all([
                    fetchAllProducts(),
                    fetchNonUser('SUPPLIER'),
                ]);
                console.log('Products:', productData);
                setProducts(productData || []);
                setSuppliers(supplierData || []);
            } catch (err) {
                // alert('Failed to load products or suppliers');
            }
        };
        loadData();
    }, []);

    const handleAddItem = () => {
        const product = products.find(p => p.id === parseInt(selectedProductId));
        if (!product) return;

        const existing = purchaseItems.find(item => item.product_id === product.id);
        if (existing) return alert('Product already added.');

        const item = {
            product_id: product.id,
            name: product.name,
            unit: product.unit,
            cost_price: product.cost_price,
            quantity: parseInt(quantity)
        };
        setPurchaseItems([...purchaseItems, item]);
        setSelectedProductId('');
        setQuantity(1);
    };

    const handleRemoveItem = (productId) => {
        setPurchaseItems(purchaseItems.filter(item => item.product_id !== productId));
    };

    const handleSubmit = async () => {
        if (!selectedSupplier || purchaseItems.length === 0) {
            return alert('Please select supplier and add at least one product.');
        }

        const payload = {
            supplier_id: parseInt(selectedSupplier),
            items: purchaseItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                cost_price: item.cost_price
            }))
        };

        try {
            await createPurchase(payload);
            alert('Purchase recorded successfully!');
            onClose();
        } catch (err) {
            alert('Failed to save purchase.');
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <div className="popup-header">
                    <h3>New Purchase</h3>
                    <button onClick={onClose}>×</button>
                </div>

                <div className="popup-body">
                    <div className="form-group">
                        <label>Supplier</label>
                        <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-inline">
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            <option value="">Select Product</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Qty"
                        />

                        <button className="add-item" onClick={handleAddItem}>Add</button>
                    </div>

                    <div className="item-list">
                        {purchaseItems.map((item) => (
                            <div key={item.product_id} className="item">
                                <span>{item.name} - {item.unit} - {item.quantity} × ${item.cost_price}</span>
                                <button onClick={() => handleRemoveItem(item.product_id)}>Remove</button>
                            </div>
                        ))}
                    </div>

                    <div className="popup-actions">
                        <button className="cancel" onClick={onClose}>Cancel</button>
                        <button className="submit" onClick={handleSubmit}>Submit Purchase</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchasePopup;
