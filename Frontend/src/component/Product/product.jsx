import React, { useState } from 'react';
import './product.css';
import { FiFolder, FiBox } from 'react-icons/fi';

const demoData = [
    { categoryName: 'Category 1', products: ['T-shirt', 'Jeans', 'Socks'] },
    { categoryName: 'Category 2', products: ['Sneakers', 'Boots'] },
    { categoryName: 'Category 3', products: ['Hat'] },
    { categoryName: 'Category 4', products: ['Jacket', 'Scarf', 'Gloves', 'Coat'] },
    { categoryName: 'Category 5', products: ['Shoes', 'Sandals'] },
    { categoryName: 'Category 6', products: ['Shirt', 'Belt', 'Watch', 'Sweater', 'Blazer'] },
];

const categoriesPerPage = 4;
const productsPerCategoryPage = 3;
const flatProductsPerPage = 9;

const Product = ({ isSidebarOpen }) => {
    const [activeTab, setActiveTab] = useState('categories');
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [categoryPage, setCategoryPage] = useState(1);
    const [productPageMap, setProductPageMap] = useState({});
    const [flatProductPage, setFlatProductPage] = useState(1);

    const handleToggleCategory = (index) => {
        setExpandedCategory(prev => (prev === index ? null : index));
    };

    // Category Pagination
    const totalCategoryPages = Math.ceil(demoData.length / categoriesPerPage);
    const paginatedCategories = demoData.slice(
        (categoryPage - 1) * categoriesPerPage,
        categoryPage * categoriesPerPage
    );

    // Flat Product Pagination (9 per page)
    const allFlatProducts = demoData.flatMap(cat =>
        cat.products.map(prod => ({
            name: prod,
            category: cat.categoryName
        }))
    );
    const totalFlatProductPages = Math.ceil(allFlatProducts.length / flatProductsPerPage);
    const paginatedFlatProducts = allFlatProducts.slice(
        (flatProductPage - 1) * flatProductsPerPage,
        flatProductPage * flatProductsPerPage
    );

    const handleProductPageChange = (catIndex, page) => {
        setProductPageMap(prev => ({
            ...prev,
            [catIndex]: page
        }));
    };

    return (
        <div className={isSidebarOpen ? "Product-content" : "Product-content collapse"}>
            <div className="top">
                <h1 className="page-title">Inventory</h1>
                <button className="bulk">Bulk Registration</button>
            </div>

            <div className="tab-navigation">
                <button
                    className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categories
                </button>
                <button
                    className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder={`Search by ${activeTab === 'categories' ? 'Category Name' : 'Product Name'}`}
                />
                <button className="close-btn">×</button>
            </div>

            {activeTab === 'categories' && (
                <div className="section">
                    <h2 className="section-title">Categories</h2>
                    <ul className="category-list">
                        {paginatedCategories.map((cat, index) => {
                            const globalIndex = (categoryPage - 1) * categoriesPerPage + index;
                            const currentProductPage = productPageMap[globalIndex] || 1;
                            const totalProductPages = Math.ceil(cat.products.length / productsPerCategoryPage);
                            const paginatedProducts = cat.products.slice(
                                (currentProductPage - 1) * productsPerCategoryPage,
                                currentProductPage * productsPerCategoryPage
                            );

                            return (
                                <li key={globalIndex} className={`category-item ${expandedCategory === globalIndex ? 'expanded' : ''}`}>
                                    <div className="category-header" onClick={() => handleToggleCategory(globalIndex)}>
                                        <div className="category-title">
                                            <FiFolder className="category-icon" />
                                            <span>{cat.categoryName}</span>
                                        </div>
                                        <span className="product-count-badge">{cat.products.length} items</span>
                                    </div>
                                    {expandedCategory === globalIndex && (
                                        <>
                                            <ul className="category-products">
                                                {paginatedProducts.map((prod, i) => (
                                                    <li key={i} className="product-in-category">
                                                        <FiBox className="product-icon" />
                                                        <span className="product-name">{prod}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {totalProductPages > 1 && (
                                                <div className="pagination">
                                                    <span
                                                        className={currentProductPage === 1 ? "disabled" : ""}
                                                        onClick={() =>
                                                            currentProductPage > 1 &&
                                                            handleProductPageChange(globalIndex, currentProductPage - 1)
                                                        }
                                                    >
                                                        ←
                                                    </span>
                                                    <span className="active">{currentProductPage}</span>
                                                    <span
                                                        className={currentProductPage === totalProductPages ? "disabled" : ""}
                                                        onClick={() =>
                                                            currentProductPage < totalProductPages &&
                                                            handleProductPageChange(globalIndex, currentProductPage + 1)
                                                        }
                                                    >
                                                        →
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {totalCategoryPages > 1 && (
                        <div className="pagination">
                            <span
                                className={categoryPage === 1 ? "disabled" : ""}
                                onClick={() => categoryPage > 1 && setCategoryPage(categoryPage - 1)}
                            >
                                ←
                            </span>
                            <span className="active">{categoryPage}</span>
                            <span
                                className={categoryPage === totalCategoryPages ? "disabled" : ""}
                                onClick={() => categoryPage < totalCategoryPages && setCategoryPage(categoryPage + 1)}
                            >
                                →
                            </span>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'products' && (
                <div className="section">
                    <h2 className="section-title">All Products</h2>
                    <ul className="product-list-flat">
                        {paginatedFlatProducts.map((prod, index) => (
                            <li key={`${prod.category}-${index}`} className="product-card">
                                <div className="product-main-info">
                                    <span className="product-name">{prod.name}</span>
                                    <span className="product-category-tag">{prod.category}</span>
                                </div>
                                <FiBox className="product-card-icon" />
                            </li>
                        ))}
                    </ul>

                    {totalFlatProductPages > 1 && (
                        <div className="pagination">
                            <span
                                className={flatProductPage === 1 ? "disabled" : ""}
                                onClick={() => flatProductPage > 1 && setFlatProductPage(flatProductPage - 1)}
                            >
                                ←
                            </span>
                            <span className="active">{flatProductPage}</span>
                            <span
                                className={flatProductPage === totalFlatProductPages ? "disabled" : ""}
                                onClick={() => flatProductPage < totalFlatProductPages && setFlatProductPage(flatProductPage + 1)}
                            >
                                →
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Product;
