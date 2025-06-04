const express = require('express');
const router = express.Router();

const { addProduct, addCategory, addUser, editUser, deleteUser } = require('../controllers/controller');

router.post('/users', addUser);
router.put('/users/:id', editUser);
router.delete('/users/:id', deleteUser);
router.post('/products', addProduct);
router.post('/categories', addCategory);

module.exports = router;
