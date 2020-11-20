const express = require('express');
const router = express.Router();

const {getcategoryId,createCategory,getCategory,getAllCategory,updateCategory,deleteCategory} = require('../controllers/category');
const {isSignedIn,isAuthenticated,isAdmin} = require('../controllers/auth');
const {getUserbyId} = require('../controllers/user');

//params
router.param('userId',getUserbyId);
router.param('categoryId',getcategoryId);
//create
router.post('/category/create/:userId',isSignedIn,isAuthenticated,isAdmin,createCategory);
//read
router.get('/category/:categoryId',getCategory);
router.get('/categories',getAllCategory);
//Update
router.put('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,updateCategory);
//Delete
router.delete('/category/:categoryId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteCategory);


module.exports = router;