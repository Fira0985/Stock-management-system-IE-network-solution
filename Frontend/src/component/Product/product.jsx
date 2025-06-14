import React from 'react';
import './product.css';

const Product = ({ isSidebarOpen }) => {
    return (
        <div className={isSidebarOpen? "Product-content": "Product-content collapse"}>
            <div className='top'>
                <h1 className="page-title">Inventory</h1>
                <button className='bulk'> Bulk Registration </button>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Search by Product Name, Category Name" />
                <button className="close-btn">×</button>
            </div>

            <div className="section">
                <h2 className="section-title">Categories</h2>
                <ul className="item-list">
                    <li>
                        <div>
                            <span className="item-name">Category 1</span>
                            <span className="item-subtext">5 products</span>
                        </div>
                        <span className="item-menu">⋯</span>
                    </li>
                    <li>
                        <div>
                            <span className="item-name">Category 2</span>
                            <span className="item-subtext">3 products</span>
                        </div>
                        <span className="item-menu">⋯</span>
                    </li>
                    <li>
                        <div>
                            <span className="item-name">Category 3</span>
                            <span className="item-subtext">1 product</span>
                        </div>
                        <span className="item-menu">⋯</span>
                    </li>
                    <li>
                        <div>
                            <span className="item-name">Category 4</span>
                            <span className="item-subtext">7 products</span>
                        </div>
                        <span className="item-menu">⋯</span>
                    </li>
                </ul>
                <div className="pagination">
                    <span className="disabled">← Previous</span>
                    <span className="active">1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>...</span>
                    <span>9</span>
                    <span>10</span>
                    <span>Next →</span>
                </div>
            </div>

            <div className="section">
                <h2 className="section-title">Products</h2>
                <ul className="item-list">
                    <li>
                        <div>
                            <span className="item-name">T-shirt</span>
                            <span className="item-subtext">Category 1</span>
                        </div>
                        <span className="item-menu">⋯</span>
                    </li>
                    <li>
                        <div>
                            <span className="item-name">Jeans</span>
                            <span className="item-subtext">Category 1</span>
                        </div>
                        <span className="item-menu">⋯</span>
                    </li>
                    <li>
                        <div>
                            <span className="item-name">Sneakers</span>
                            <span className="item-subtext">Category 2</span>
                        </div>
                        <span className="item-menu">⋯</span>
                    </li>
                    <li>
                        <div>
                            <span className="item-name">Hat</span>
                            <span className="item-subtext">Category 3</span>
                        </div>
                        <span className="item-menu">⋯</span>
                    </li>
                </ul>
                <div className="pagination">
                    <span className="disabled">← Previous</span>
                    <span className="active">1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>...</span>
                    <span>67</span>
                    <span>68</span>
                    <span>Next →</span>
                </div>
            </div>
        </div>
    );
};

export default Product;
