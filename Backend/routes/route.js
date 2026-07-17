const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { authenticateToken, loginUser, refreshToken } = require('../middleware/auth');
const { addProduct, editProduct, getAllProducts, getProductById } = require('../controllers/product')
const { addCategory, editCategory, getAllCategories, getCategoryById, deleteCategory } = require('../controllers/category')
const { addUser, editUser, deleteUser, getAllUsers, getUserByEmail, uploadProfileImage, verifyUser, verifyCode, changePassword, getImage, RecoverUser } = require('../controllers/user')
const { addNonUser, editNonUser, deleteNonUser, getAllNonUsers, getNonUserById } = require('../controllers/nonUser');
const { getAllPurchase, addPurchase } = require('../controllers/purchase');
const { uploadExcelFile } = require('../controllers/uploadExcelFile');
const { getAllSales, addSales } = require('../controllers/sale');
const creditController = require("../controllers/credit");
const reportController = require('../controllers/reportController');
const { sendSelfMessage } = require('../controllers/emailController');
const notificationController = require('../controllers/notificationController');

// Role-based protection middleware
const authorize = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }
        next();
    };
};

const {
    getSalesOverview,
    getPurchaseOverview,
    getWeeklySalesChart,
    getMonthlyCategoryChart,
    getAnnualSalesChart,
    getRecentActivity
} = require('../controllers/statistics');

// Auth Routes
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/verify-user', verifyUser); // For initial setup/invitation
router.get('/recover-user', (req, res) => {
    res.status(200).json({
        message: 'Use POST /api/recover-user to request a password reset code.'
    });
});
router.post('/recover-user', RecoverUser);
router.post('/verify-code', verifyCode);
router.post('/change-password', changePassword);

// User Management (OWNER only)
router.post('/users', authenticateToken, authorize('OWNER'), addUser);
router.get('/users', authenticateToken, authorize('OWNER'), getAllUsers);
router.put('/editUser', authenticateToken, authorize('OWNER'), editUser);
router.delete('/deleteUser', authenticateToken, authorize('OWNER'), deleteUser);

// General User Profile
router.post('/upload-profile', authenticateToken, upload.single('image'), uploadProfileImage);
router.post('/getUserByEmail', authenticateToken, getUserByEmail);
router.post('/getImage', authenticateToken, getImage);

router.get('/products', authenticateToken, getAllProducts);
router.post('/getProductById', authenticateToken, getProductById);
router.post('/products', authenticateToken, upload.single('image'), addProduct);
router.put('/products/:id', authenticateToken, editProduct);

router.post('/categories', authenticateToken, addCategory);
router.get('/categories', authenticateToken, getAllCategories);
router.post('/editCategories', authenticateToken, editCategory);
router.post('/getCategoryById', authenticateToken, getCategoryById)
router.delete('/deleteCategory', authenticateToken, deleteCategory)

router.post('/NonUser', authenticateToken, addNonUser)
router.put("/editNonUser/:id", editNonUser);

router.delete('/deleteNonUser', authenticateToken, deleteNonUser)
router.get('/NonUser', authenticateToken, getAllNonUsers)
router.post('/getNonUserById', authenticateToken, getNonUserById)

router.post('/getAllPurchase', authenticateToken, getAllPurchase)
router.post('/purchase', authenticateToken, addPurchase)

router.get('/getAllSales', authenticateToken, getAllSales)
router.post('/sale', authenticateToken, addSales)

// Sales overview stats
router.get('/sales/overview', authenticateToken, getSalesOverview);

// Purchase overview stats
router.get('/purchase/overview', authenticateToken, getPurchaseOverview);

// Weekly sales bar chart
router.get('/sales/chart/weekly', authenticateToken, getWeeklySalesChart);

// Monthly sales by category pie chart
router.get('/sales/chart/by-category', authenticateToken, getMonthlyCategoryChart);

// Annual sales line chart
router.get('/sales/chart/annual', authenticateToken, getAnnualSalesChart);

// Recent sales/purchases activity
router.get('/recent-activity', authenticateToken, getRecentActivity);

// Excel upload (if needed)
router.post('/upload-excel', upload.single('excelFile'), uploadExcelFile);


router.get("/credits", authenticateToken, creditController.getAllCredits);
router.get("/paid", authenticateToken, creditController.getPaidCredits);
router.get("/unpaid", authenticateToken, creditController.getUnpaidCredits);
router.get("/partial", authenticateToken, creditController.getPartialCredits);
router.post('/makePayment', authenticateToken, creditController.makePayment);

router.get('/summarySales', authenticateToken, reportController.getSalesSummary);
router.get('/summaryInventory', authenticateToken, reportController.getInventorySummary);
router.get('/summaryPurchases', authenticateToken, reportController.getPurchaseSummary);
router.get('/summaryPayments', authenticateToken, reportController.getPaymentSummary);
router.get('/summaryUsers', authenticateToken, reportController.getUserActivitySummary);
router.get('/summaryBusiness', authenticateToken, reportController.getBusinessHealthSummary);

router.post('/message', sendSelfMessage);

// Add this route for notifications
router.get('/api/notifications/user', notificationController.getNotifications);



module.exports = router;
