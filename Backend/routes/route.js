const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/auth');
const {addProduct, editProduct,} = require('../controllers/product')
const {addCategory, editCategory} = require('../controllers/category')
const {addUser, editUser, deleteUser} = require('../controllers/user')
const { addNonUser, editNonUser, deleteNonUser } = require('../controllers/nonUser');
const { loginUser } = require('../middleware/auth');

router.post('/users', authenticateToken,  addUser);
router.put('/editUser', authenticateToken , editUser);
router.delete('/deleteUser', authenticateToken,  deleteUser);
router.post('/products', authenticateToken,  addProduct);
router.post('/categories', authenticateToken, addCategory);
router.put('/products/:id', authenticateToken, editProduct);
router.put('/categories/:id', authenticateToken, editCategory);
router.post('/login', loginUser)
router.post('/NonUser', authenticateToken,  addNonUser)
router.put('/editNonUser', authenticateToken,  editNonUser)
router.delete('/deleteNonUser', authenticateToken,  deleteNonUser)

module.exports = router;
