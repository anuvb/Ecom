const express = require('express');
const router = express.Router();
const {getUserbyId, getUser,getallUser,updateUser,userPurchaseList} = require('../controllers/user');
const {isSignedIn,isAuthenticated} = require('../controllers/auth');

router.param('userId',getUserbyId);
router.get('/user/:userId',isSignedIn, isAuthenticated, getUser);
//router.get('/user',getallUser);
router.put('/user/:userId',isSignedIn,isAuthenticated,updateUser);
router.get('/orders/user/:userId',isSignedIn,isAuthenticated,userPurchaseList);

module.exports = router;