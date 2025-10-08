import React, { useState } from 'react';
import './productDetail.css';
import { FiEdit2, FiX } from 'react-icons/fi';

const ProductDetailPopup = ({ product, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [productName, setProductName] = useState(product.name);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // TODO: send updated name to backend
    console.log('Updated name:', productName);
  };

  return (
    <div className="product-popup-overlay" onClick={onClose}>
      <div className="product-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}><FiX /></button>

        <div className="product-header">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="product-image" />
          ) : (
            <div className="product-image placeholder">No Image</div>
          )}

          <div className="product-info">
            <form onSubmit={handleEditSubmit} className="product-name-edit">
              {isEditing ? (
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  onBlur={handleEditSubmit}
                  autoFocus
                  className="edit-input"
                />
              ) : (
                <h2 className="product-title">
                  {productName}
                  {/* <FiEdit2 className="edit-icon" onClick={handleEditClick} /> */}
                </h2>
              )}
            </form>

            <p><strong>Barcode:</strong> {product.barcode || 'N/A'}</p>
            <p><strong>Unit:</strong> {product.unit || 0}</p>
            <p><strong>Sale Price:</strong> ${product.sale_price}</p>
            <p><strong>Cost Price:</strong> ${product.cost_price}</p>
            <p><strong>Category:</strong> {product.category.name || 'N/A'}</p>
            <p><strong>Created By:</strong> {product.created_by.username || 'N/A'}</p>
            <p><strong>Created At:</strong> {new Date(product.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="product-lists">
          <div className="transaction-section">
            <h3>Sale Items</h3>
            <ul>
              {product.saleItems?.length > 0 ? (
                product.saleItems.map((item, i) => (
                  <li key={i}>Quantity: {item.quantity}, Date: {new Date(item.created_at).toLocaleDateString()}</li>
                ))
              ) : (
                <li>No sale records</li>
              )}
            </ul>
          </div>

          <div className="transaction-section">
            <h3>Purchase Items</h3>
            <ul>
              {product.purchaseItems?.length > 0 ? (
                product.purchaseItems.map((item, i) => (
                  <li key={i}>Quantity: {item.quantity}, Date: {new Date(item.created_at).toLocaleDateString()}</li>
                ))
              ) : (
                <li>No purchase records</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPopup;
