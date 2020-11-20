const express = require('express');
const router = express.Router();
const { getProductbyId,createProduct,getproduct,photo,deleteProduct,updateProduct,getallProduct,getAllUniqueCategories } = require('../controllers/product');
const { getUserbyId } = require('../controllers/user');
const { isSignedIn,isAuthenticated,isAdmin } = require('../controllers/auth');

//Routes
//parameter routes
router.param('productId',getProductbyId);
router.param('userId',getUserbyId);
//create route
router.post('/product/create/:userId',isSignedIn,isAuthenticated,isAdmin,createProduct);
//read routes
router.get('/product/:productId',getproduct);
router.get('/product/photo/:productId',photo);
//delete route
router.delete('/product/delete/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteProduct);
//update route
router.put('/product/update/:productId/:userID',isSignedIn,isAuthenticated,isAdmin,updateProduct);
//listing route
router.get('/product',getallProduct);
router.get('/product/categories',getAllUniqueCategories);

module.exports = router;