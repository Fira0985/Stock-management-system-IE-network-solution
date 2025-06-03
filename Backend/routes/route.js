const express = require('express');
const router = express.Router();

const { addProduct, addCategory } = require('../controllers/controller');

router.post('/products', addProduct);
router.post('/categories', addCategory);

module.exports = router;
