const express = require('express');
const router = express.Router();

const { getUserbyId,userPurchaseList } = require('../controllers/user');
const { isSignedIn,isAuthenticated,isAdmin } = require('../controllers/auth');
const { updateStock } = require('../controllers/product');
const {getOrderbyId,createOrder,getAllOrders} = require('../controllers/order');

//params
router.param("userId",getUserbyId);
router.param("orderId",getOrderbyId);

router.post('/order/create/:userId',isSignedIn,isAuthenticated,userPurchaseList,updateStock,createOrder);

router.get('/order/all/:userId',isSignedIn,isAuthenticated,isAdmin,getAllOrders);

module.exports = router;