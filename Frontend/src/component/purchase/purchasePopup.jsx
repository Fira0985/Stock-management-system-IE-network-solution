import React, { useEffect, useState } from 'react';
import './purchasePopup.css';
import { fetchAllProducts } from '../../services/productService';
import { fetchNonUser } from '../../services/nonUserService';
import { createPurchase } from '../../services/purchaseService';
import { toast } from 'react-toastify';

const PurchasePopup = ({ onClose, onSuccess }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [purchaseItems, setPurchaseItems] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const [supplierInput, setSupplierInput] = useState('');
    const [productInput, setProductInput] = useState('');
    const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
    const [showProductSuggestions, setShowProductSuggestions] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productData, supplierData] = await Promise.all([
                    fetchAllProducts(),
                    fetchNonUser('SUPPLIER'),
                ]);
                setProducts(productData || []);
                setSuppliers(supplierData || []);
            } catch (err) {
                toast.error('Failed to load products or suppliers');
            }
        };
        loadData();
    }, []);

    const handleSelectSupplier = (supplier) => {
        setSelectedSupplier(supplier.id.toString());
        setSupplierInput(supplier.name);
        setShowSupplierSuggestions(false);
    };

    const handleSelectProduct = (product) => {
        setSelectedProductId(product.id.toString());
        setProductInput(product.name);
        setShowProductSuggestions(false);
    };

    const handleAddItem = () => {
        const product = products.find(p => p.id === parseInt(selectedProductId));
        if (!product) return toast.error('Please select a valid product');

        const existing = purchaseItems.find(item => item.product_id === product.id);
        if (existing) return toast.error('Product already added.');

        const item = {
            product_id: product.id,
            name: product.name,
            unit: product.unit,
            cost_price: product.cost_price,
            quantity: parseInt(quantity)
        };
        setPurchaseItems([...purchaseItems, item]);
        setSelectedProductId('');
        setProductInput('');
        setQuantity(1);
    };

    const handleRemoveItem = (productId) => {
        setPurchaseItems(purchaseItems.filter(item => item.product_id !== productId));
    };

    const handleSubmit = async () => {
        if (!selectedSupplier || purchaseItems.length === 0) {
            return toast.warn('Please select supplier and add at least one product.');
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
            toast.success('Purchase recorded successfully!');
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            toast.error('Failed to save purchase.');
        }
    };

    return (
        <div className="pr-popup-overlay">
            <div className="pr-popup-box">
                <div className="pr-popup-header">
                    <h3>New Purchase</h3>
                    <button onClick={onClose}>×</button>
                </div>

                <div className="pr-popup-body">
                    <div className="pr-form-group pr-autocomplete">
                        <label>Supplier</label>
                        <input
                            type="text"
                            value={supplierInput}
                            onChange={(e) => {
                                setSupplierInput(e.target.value);
                                setShowSupplierSuggestions(true);
                            }}
                            onFocus={() => setShowSupplierSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSupplierSuggestions(false), 150)}
                            placeholder="Type to search supplier"
                        />
                        {showSupplierSuggestions && (
                            <div className="pr-suggestions">
                                {suppliers
                                    .filter(s => s.name.toLowerCase().includes(supplierInput.toLowerCase()))
                                    .map(s => (
                                        <div key={s.id} className="pr-suggestion-item" onClick={() => handleSelectSupplier(s)}>
                                            {s.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="pr-form-inline pr-autocomplete">
                        <input
                            type="text"
                            value={productInput}
                            onChange={(e) => {
                                setProductInput(e.target.value);
                                setShowProductSuggestions(true);
                            }}
                            onFocus={() => setShowProductSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowProductSuggestions(false), 150)}
                            placeholder="Type to search product"
                        />
                        {showProductSuggestions && (
                            <div className="pr-suggestions">
                                {products
                                    .filter(p => p.name.toLowerCase().includes(productInput.toLowerCase()))
                                    .map(p => (
                                        <div key={p.id} className="pr-suggestion-item" onClick={() => handleSelectProduct(p)}>
                                            {p.name}
                                        </div>
                                    ))}
                            </div>
                        )}

                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Qty"
                        />

                        <button className="pr-add-item" onClick={handleAddItem}>Add</button>
                    </div>

                    <div className="pr-item-list">
                        {purchaseItems.map((item) => (
                            <div key={item.product_id} className="pr-item">
                                <span>{item.name} - {item.unit} - {item.quantity} × ${item.cost_price}</span>
                                <button onClick={() => handleRemoveItem(item.product_id)}>Remove</button>
                            </div>
                        ))}
                    </div>

                    <div className="pr-popup-actions">
                        <button className="pr-cancel" onClick={onClose}>Cancel</button>
                        <button className="pr-submit" onClick={handleSubmit}>Submit Purchase</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchasePopup;