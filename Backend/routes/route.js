const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { authenticateToken } = require('../middleware/auth');
const {addProduct, editProduct, getAllProducts, getProductById} = require('../controllers/product')
const {addCategory, editCategory, getAllCategories, getCategoryById, deleteCategory} = require('../controllers/category')
const {addUser, editUser, deleteUser, getAllUsers, getUserByEmail, uploadProfileImage} = require('../controllers/user')
const { addNonUser, editNonUser, deleteNonUser, getAllNonUsers, getNonUserById} = require('../controllers/nonUser');
const { loginUser } = require('../middleware/auth');


router.post('/users', authenticateToken,  addUser);
router.put('/editUser', authenticateToken , editUser);
router.delete('/deleteUser', authenticateToken,  deleteUser);
router.get('/users', authenticateToken, getAllUsers);
router.post('/getUserByEmail', authenticateToken, getUserByEmail);
router.post('/login', loginUser)

router.get('/products', authenticateToken, getAllProducts);
router.post('/getProductById', authenticateToken, getProductById);
router.post('/products', authenticateToken,  addProduct);
router.put('/products/:id', authenticateToken, editProduct);

router.post('/categories', authenticateToken, addCategory);
router.get('/categories', authenticateToken, getAllCategories);
router.put('/categories', authenticateToken, editCategory);
router.post('/getCategoryById', authenticateToken, getCategoryById)
router.delete('/deleteCategory', authenticateToken, deleteCategory)

router.post('/NonUser', authenticateToken,  addNonUser)
router.put("/editNonUser/:id", editNonUser);

router.delete('/deleteNonUser', authenticateToken,  deleteNonUser)
router.get('/NonUser', authenticateToken, getAllNonUsers)
router.post('/getNonUserById', authenticateToken, getNonUserById)
router.post('/upload-profile', upload.single('image'), uploadProfileImage);

module.exports = router;
