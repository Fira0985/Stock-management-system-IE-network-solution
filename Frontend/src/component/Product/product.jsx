import React, { useState, useEffect, useMemo } from 'react';
import './product.css';
import { FiFolder, FiBox, FiMoreVertical, FiDownload } from 'react-icons/fi';
import {
    fetchCategory,
    fetchCategoryById,
    addCategory,
    editCategory,
    deleteCategory
} from '../../services/categoryService';
import { addProduct, fetchProductById } from '../../services/productService';
import { exportProducts } from "../../services/exportService";
import ProductForm from './Forms/CategoryForm/ProductForm';
import AddForm from './Forms/ProductForms/AddForm';
import DeleteProductForm from './Forms/CategoryForm/deleteProductForm';
import ProductDetailPopup from './Forms/ProductForms/productDetail';
import ExcelUpload from './Forms/ExcelForm/ExcelUpload';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categoriesPerPage = 4;
const productsPerCategoryPage = 3;
const flatProductsPerPage = 9;

const Product = ({ isSidebarOpen }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [categoryPage, setCategoryPage] = useState(1);
    const [productPageMap, setProductPageMap] = useState({});
    const [flatProductPage, setFlatProductPage] = useState(1);
    const [menuOpen, setMenuOpen] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [formInitialData, setFormInitialData] = useState({});
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    const [isDeleteFormOpen, setIsDeleteFormOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [role, setRole] = useState(() => localStorage.getItem('role') || '');

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    // Reset pagination when search term changes
    useEffect(() => {
        setCategoryPage(1);
        setFlatProductPage(1);
        setProductPageMap({});
    }, [searchTerm]);

    const loadCategories = async () => {
        try {
            const res = await fetchCategory();
            setCategories(res.data || []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            toast.error('Failed to load categories');
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
            toast.error('Failed to load products');
        }
    };

    // Create a flat list of all products with category names
    const allFlatProducts = useMemo(() => {
        return categories.flatMap(cat =>
            cat.products.map(prod => ({
                ...prod,
                category: cat.name
            }))
        );
    }, [categories]);

    // Filter categories based on search term
    const filteredCategories = useMemo(() => {
        if (!searchTerm) return categories;
        const term = searchTerm.toLowerCase();
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(term)
        );
    }, [categories, searchTerm]);

    // Filter flat products based on search term
    const filteredFlatProducts = useMemo(() => {
        if (!searchTerm) return allFlatProducts;
        const term = searchTerm.toLowerCase();
        return allFlatProducts.filter(prod =>
            prod.name.toLowerCase().includes(term) ||
            prod.category.toLowerCase().includes(term)
        );
    }, [allFlatProducts, searchTerm]);

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
            toast.success('Category added successfully');
        } catch (err) {
            toast.error('Failed to add category');
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
            toast.success('Product added successfully');
        } catch (err) {
            toast.error(err.message || 'Failed to add product');
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
            toast.error('Failed to load category data');
        }
    };

    const handleEditCategorySubmit = async (data) => {
        try {
            await editCategory({ categoryId: editingCategoryId, name: data.name });
            await loadCategories();
            setIsFormOpen(false);
            toast.success('Category updated successfully');
        } catch (err) {
            toast.error('Failed to edit category');
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
            toast.success('Category deleted successfully');
        } catch (err) {
            toast.error(err.message || 'Cannot delete category with products');
        }
    };

    const totalCategoryPages = Math.ceil(filteredCategories.length / categoriesPerPage);
    const paginatedCategories = filteredCategories.slice(
        (categoryPage - 1) * categoriesPerPage,
        categoryPage * categoriesPerPage
    );

    const totalFlatProductPages = Math.ceil(filteredFlatProducts.length / flatProductsPerPage);
    const paginatedFlatProducts = filteredFlatProducts.slice(
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

    // Optionally, update role if it changes in localStorage (e.g., after login)
    useEffect(() => {
        const handleStorage = () => setRole(localStorage.getItem('role') || '');
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <div className={isSidebarOpen ? "pd-Product-content" : "pd-Product-content pd-collapse"}>
            <div className="pd-top">
                <h1 className="pd-page-title">Inventory</h1>
                <button
                    className="pd-add"
                    onClick={handleAddCategory}
                    disabled={role === 'CLERK'}
                    style={role === 'CLERK' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                    Add Category
                </button>
                <button
                    className="pd-bulk"
                    onClick={handleAddProduct}
                    disabled={role === 'CLERK'}
                    style={role === 'CLERK' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                    Add Product
                </button>
                <button
                    className="pd-bulk"
                    onClick={() => setModalOpen(true)}
                    disabled={role === 'CLERK'}
                    style={role === 'CLERK' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                    Import
                </button>
                <button
                    className="pd-export-btn"
                    onClick={() => exportProducts(allProducts)}
                >
                    <FiDownload style={{ marginRight: 4 }} />
                    Export
                </button>
            </div>

            <div className="pd-tab-navigation">
                <button
                    className={`pd-tab-button ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>

                <button
                    className={`pd-tab-button ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categories
                </button>
            </div>

            <div className="pd-search-bar">
                <input
                    type="text"
                    placeholder={`Search by ${activeTab === 'categories' ? 'Category Name' : 'Product Name'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {activeTab === 'products' && (
                <div className="pd-section">
                    <h2 className="pd-section-title">All Products</h2>

                    {filteredFlatProducts.length === 0 ? (
                        <p className="pd-no-results">No products found matching your search</p>
                    ) : (
                        <>
                            <ul className="pd-product-list-flat">
                                {paginatedFlatProducts.map((prod, index) => {
                                    const fullProduct = allProducts.find(p => p.name === prod.name) || prod;

                                    return (
                                        <li
                                            key={`${prod.category}-${index}`}
                                            className="pd-product-card"
                                            onClick={() => openProductDetail(fullProduct)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="pd-product-main-info">
                                                <span className="pd-product-name">{prod.name}</span>
                                                <span className="pd-product-category-tag">{prod.category}</span>
                                            </div>
                                            <FiBox className="pd-product-card-icon" />
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
                                        ← Previous
                                    </span>
                                    {Array.from({ length: totalFlatProductPages }, (_, i) => (
                                        <span
                                            key={i + 1}
                                            className={flatProductPage === i + 1 ? "active" : ""}
                                            onClick={() => setFlatProductPage(i + 1)}
                                        >
                                            {i + 1}
                                        </span>
                                    ))}
                                    <span
                                        className={flatProductPage === totalFlatProductPages ? "disabled" : ""}
                                        onClick={() => flatProductPage < totalFlatProductPages && setFlatProductPage(flatProductPage + 1)}
                                    >
                                        Next →
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="pd-section">
                    <h2 className="pd-section-title">Categories</h2>

                    {filteredCategories.length === 0 ? (
                        <p className="pd-no-results">No categories found matching your search</p>
                    ) : (
                        <>
                            <ul className="pd-category-list">
                                {paginatedCategories.map((cat, index) => {
                                    const globalIndex = (categoryPage - 1) * categoriesPerPage + index;
                                    const currentProductPage = productPageMap[globalIndex] || 1;

                                    // Filter products within category based on search term
                                    const filteredProducts = cat.products.filter(prod =>
                                        !searchTerm ||
                                        prod.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    );

                                    const totalProductPages = Math.ceil(filteredProducts.length / productsPerCategoryPage);
                                    const paginatedProducts = filteredProducts.slice(
                                        (currentProductPage - 1) * productsPerCategoryPage,
                                        currentProductPage * productsPerCategoryPage
                                    );

                                    return (
                                        <li key={cat.id} className={`pd-category-item ${expandedCategory === globalIndex ? 'expanded' : ''}`}>
                                            <div className="pd-category-header" onClick={() => handleToggleCategory(globalIndex)}>
                                                <div className="pd-category-title">
                                                    <FiFolder className="pd-category-icon" />
                                                    <span>{cat.name}</span>
                                                </div>
                                                <span className="pd-product-count-badge">{filteredProducts.length} items</span>
                                                <div className="pd-item-menu" onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpen(menuOpen === cat.id ? null : cat.id);
                                                }}>
                                                    <FiMoreVertical />
                                                    {menuOpen === cat.id && (
                                                        <div >
                                                            <div className="pd-popup-item pd-edit-item" onClick={() => handleEditCategory(cat.id)}>Edit</div>
                                                            <div className="pd-popup-item pd-delete-item" onClick={() => handleDeleteCategory(cat)}>Delete</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {expandedCategory === globalIndex && (
                                                <>
                                                    <ul className="pd-category-products">
                                                        {paginatedProducts.map((prod, index) => {
                                                            const fullProduct = allProducts.find(p => p.name === prod.name) || prod;

                                                            return (
                                                                <li
                                                                    key={`${prod.category}-${index}`}
                                                                    className="pd-product-card"
                                                                    onClick={() => openProductDetail(fullProduct)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <div className="pd-product-main-info">
                                                                        <span className="pd-product-name">{prod.name}</span>
                                                                        <span className="pd-product-category-tag">{prod.category}</span>
                                                                    </div>
                                                                    <FiBox className="pd-product-card-icon" />
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
                                                                ← Previous
                                                            </span>
                                                            {Array.from({ length: totalProductPages }, (_, i) => (
                                                                <span
                                                                    key={i + 1}
                                                                    className={currentProductPage === i + 1 ? "active" : ""}
                                                                    onClick={() =>
                                                                        handleProductPageChange(globalIndex, i + 1)
                                                                    }
                                                                >
                                                                    {i + 1}
                                                                </span>
                                                            ))}
                                                            <span
                                                                className={currentProductPage === totalProductPages ? "disabled" : ""}
                                                                onClick={() =>
                                                                    currentProductPage < totalProductPages &&
                                                                    handleProductPageChange(globalIndex, currentProductPage + 1)
                                                                }
                                                            >
                                                                Next →
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
                                        ← Previous
                                    </span>
                                    {Array.from({ length: totalCategoryPages }, (_, i) => (
                                        <span
                                            key={i + 1}
                                            className={categoryPage === i + 1 ? "active" : ""}
                                            onClick={() => setCategoryPage(i + 1)}
                                        >
                                            {i + 1}
                                        </span>
                                    ))}
                                    <span
                                        className={categoryPage === totalCategoryPages ? "disabled" : ""}
                                        onClick={() => categoryPage < totalCategoryPages && setCategoryPage(categoryPage + 1)}
                                    >
                                        Next →
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* ... rest of the component (forms, popups, etc) remains the same ... */}
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

            <ExcelUpload isOpen={modalOpen} onClose={() => setModalOpen(false)} />

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Product;