import React, { useState, useEffect } from 'react';
import './product.css';
import { FiFolder, FiBox, FiMoreVertical } from 'react-icons/fi';
import {
    fetchCategory,
    fetchCategoryById,
    addCategory,
    editCategory,
    deleteCategory
} from '../../services/categoryService';
import { addProduct, fetchProductById } from '../../services/productService';
import ProductForm from './ProductForm';
import AddForm from './AddForm';
import DeleteProductForm from './deleteProductForm';
import ProductDetailPopup from './productDetail';

const categoriesPerPage = 4;
const productsPerCategoryPage = 3;
const flatProductsPerPage = 9;

const Product = ({ isSidebarOpen }) => {
    const [activeTab, setActiveTab] = useState('categories');
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [categoryPage, setCategoryPage] = useState(1);
    const [productPageMap, setProductPageMap] = useState({});
    const [flatProductPage, setFlatProductPage] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [formInitialData, setFormInitialData] = useState({});
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await fetchCategory();
            setCategories(res.data || []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const loadProducts = async () => {
        try {
            const productIds = [];

            // Collect all product IDs from the categories
            const res = await fetchCategory();
            const cats = res.data || [];

            cats.forEach(cat => {
                cat.products.forEach(prod => {
                    if (!prod.archived) {
                        productIds.push(prod.id);
                    }
                });
            });

            // Fetch each product by ID
            const fetchedProducts = [];
            for (const id of productIds) {
                try {
                    const product = await fetchProductById(id);
                    fetchedProducts.push(product);
                } catch (err) {
                    console.warn(`Could not load product with ID ${id}`);
                }
            }

            setAllProducts(fetchedProducts);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    };

    const handleToggleCategory = (index) => {
        setExpandedCategory(prev => (prev === index ? null : index));
    };

    const handleAddCategory = () => {
        setFormInitialData({});
        setIsEditMode(false);
        setIsFormOpen(true);
    };

    const handleAddCategorySubmit = async (data) => {
        try {
            await addCategory({
                name: data.name,
                created_by_id: parseInt(localStorage.getItem('id'))
            });
            await loadCategories();
            setIsFormOpen(false);
        } catch (err) {
            alert('Failed to add category');
        }
    };

    const handleAddProduct = () => {
        setIsAddFormOpen(true);
    };

    const handleAddProductSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('sale_price', parseFloat(data.sale_price));
            formData.append('cost_price', parseFloat(data.cost_price));
            formData.append('category_id', parseInt(data.category));
            formData.append('created_by_id', parseInt(localStorage.getItem('id')));
            if (data.image_file) {
                formData.append('image', data.image_file);
            }

            await addProduct(formData);
            await loadCategories();
            await loadProducts();
            setIsAddFormOpen(false);
        } catch (err) {
            alert(err.message || 'Failed to add product');
        }
    };

    const handleEditCategory = async (id) => {
        try {
            const existing = await fetchCategoryById(id);
            setFormInitialData(existing);
            setEditingCategoryId(id);
            setIsEditMode(true);
            setIsFormOpen(true);
        } catch (err) {
            alert('Failed to load category data');
        }
    };

    const handleEditCategorySubmit = async (data) => {
        try {
            await editCategory({ categoryId: editingCategoryId, name: data.name });
            await loadCategories();
            setIsFormOpen(false);
        } catch (err) {
            alert('Failed to edit category');
        }
    };

    const handleDeleteCategory = (category) => {
        setCategoryToDelete(category);
        setIsDeleteFormOpen(true);
    };

    const confirmDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete.id, parseInt(localStorage.getItem('id')));
            await loadCategories();
            setIsDeleteFormOpen(false);
            setCategoryToDelete(null);
        } catch (err) {
            alert(err.message || 'Cannot delete category with products');
        }
    };

    const totalCategoryPages = Math.ceil(categories.length / categoriesPerPage);
    const paginatedCategories = categories.slice(
        (categoryPage - 1) * categoriesPerPage,
        categoryPage * categoriesPerPage
    );

    const allFlatProducts = categories.flatMap(cat =>
        cat.products.map(prod => ({
            ...prod,
            category: cat.name
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

    const openProductDetail = (product) => {
        setSelectedProduct(product);
        setIsProductDetailOpen(true);
    };

    const closeProductDetail = () => {
        setIsProductDetailOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className={isSidebarOpen ? "Product-content" : "Product-content collapse"}>
            <div className="top">
                <h1 className="page-title">Inventory</h1>
                <button className="add" onClick={handleAddCategory}>Add Category</button>
                <button className="bulk" onClick={handleAddProduct}>Add Product</button>
                <button className="bulk" >Bulk Registration</button>
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
                                <li key={cat.id} className={`category-item ${expandedCategory === globalIndex ? 'expanded' : ''}`}>
                                    <div className="category-header" onClick={() => handleToggleCategory(globalIndex)}>
                                        <div className="category-title">
                                            <FiFolder className="category-icon" />
                                            <span>{cat.name}</span>
                                        </div>
                                        <span className="product-count-badge">{cat.products.length} items</span>
                                        <div className="item-menu" onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpen(menuOpen === cat.id ? null : cat.id);
                                        }}>
                                            <FiMoreVertical />
                                            {menuOpen === cat.id && (
                                                <div className="popup-menu">
                                                    <div className="popup-item edit-item" onClick={() => handleEditCategory(cat.id)}>Edit</div>
                                                    <div className="popup-item delete-item" onClick={() => handleDeleteCategory(cat)}>Delete</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {expandedCategory === globalIndex && (
                                        <>
                                            <ul className="category-products">
                                                {paginatedProducts.map((prod, index) => {
                                                    const fullProduct = allProducts.find(p => p.name === prod.name) || prod;

                                                    return (
                                                        <li
                                                            key={`${prod.category}-${index}`}
                                                            className="product-card"
                                                            onClick={() => openProductDetail(fullProduct)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <div className="product-main-info">
                                                                <span className="product-name">{prod.name}</span>
                                                                <span className="product-category-tag">{prod.category}</span>
                                                            </div>
                                                            <FiBox className="product-card-icon" />
                                                        </li>
                                                    );
                                                })}
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
                        {paginatedFlatProducts.map((prod, index) => {
                            const fullProduct = allProducts.find(p => p.name === prod.name) || prod;

                            return (
                                <li
                                    key={`${prod.category}-${index}`}
                                    className="product-card"
                                    onClick={() => openProductDetail(fullProduct)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="product-main-info">
                                        <span className="product-name">{prod.name}</span>
                                        <span className="product-category-tag">{prod.category}</span>
                                    </div>
                                    <FiBox className="product-card-icon" />
                                </li>
                            );
                        })}
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

            {isFormOpen && (
                <ProductForm
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={isEditMode ? handleEditCategorySubmit : handleAddCategorySubmit}
                    initialData={formInitialData}
                    isEdit={isEditMode}
                />
            )}

            {isAddFormOpen && (
                <AddForm
                    onCancel={() => setIsAddFormOpen(false)}
                    onSubmit={handleAddProductSubmit}
                    categories={categories}
                />
            )}

            {isDeleteFormOpen && (
                <DeleteProductForm
                    onClose={() => {
                        setIsDeleteFormOpen(false);
                        setCategoryToDelete(null);
                    }}
                    onConfirm={confirmDeleteCategory}
                    Category={categoryToDelete}
                />
            )}

            {isProductDetailOpen && selectedProduct && (
                <ProductDetailPopup product={selectedProduct} onClose={closeProductDetail} />
            )}
        </div>
    );
};

export default Product;