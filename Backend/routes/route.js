const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { authenticateToken } = require('../middleware/auth');
const {addProduct, editProduct, getAllProducts, getProductById} = require('../controllers/product')
const {addCategory, editCategory, getAllCategories, getCategoryById, deleteCategory} = require('../controllers/category')
const {addUser, editUser, deleteUser, getAllUsers, getUserByEmail, uploadProfileImage, verifyUser, verifyCode, changePassword, getImage, RecoverUser} = require('../controllers/user')
const { addNonUser, editNonUser, deleteNonUser, getAllNonUsers, getNonUserById} = require('../controllers/nonUser');
const { loginUser } = require('../middleware/auth');
const { getAllPurchase, addPurchase } = require('../controllers/purchase');
const { uploadExcelFile } = require('../controllers/uploadExcelFile');



router.post('/users', authenticateToken,  addUser);
router.put('/editUser', authenticateToken , editUser);
router.delete('/deleteUser', authenticateToken,  deleteUser);
router.get('/users', authenticateToken, getAllUsers);
router.post('/getUserByEmail', authenticateToken, getUserByEmail);
router.post('/login', loginUser)
router.post('/upload-profile', authenticateToken, upload.single('image'), uploadProfileImage);
router.post('/verify-user', verifyUser)
router.post('/recover-user', RecoverUser)
router.post('/verify-code', verifyCode)
router.post('/change-password', changePassword)
router.post('/getImage', authenticateToken, getImage);

router.get('/products', authenticateToken, getAllProducts);
router.post('/getProductById', authenticateToken, getProductById);
router.post('/products', authenticateToken, upload.single('image'),  addProduct);
router.put('/products/:id', authenticateToken, editProduct);

router.post('/categories', authenticateToken, addCategory);
router.get('/categories', authenticateToken, getAllCategories);
router.post('/editCategories', authenticateToken, editCategory);
router.post('/getCategoryById', authenticateToken, getCategoryById)
router.delete('/deleteCategory', authenticateToken, deleteCategory)

router.post('/NonUser', authenticateToken,  addNonUser)
router.put("/editNonUser/:id", editNonUser);

router.delete('/deleteNonUser', authenticateToken,  deleteNonUser)
router.get('/NonUser', authenticateToken, getAllNonUsers)
router.post('/getNonUserById', authenticateToken, getNonUserById)

router.post('/getAllPurchase', authenticateToken, getAllPurchase)
router.post('/purchase', authenticateToken, addPurchase)

// POST route to upload Excel and insert data into DB
router.post('/upload-excel', upload.single('excelFile'), uploadExcelFile);

module.exports = router;
