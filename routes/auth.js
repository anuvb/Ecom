const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {signout,signup,signin,isSignedIn} = require('../controllers/auth');

//Router
router.post('/signup', [
    body("name", "Name must be atleast 3 characters").isLength({min : 3}),
    body("email", "email is required").isEmail(),
    body("password", "Password must be atleast 3 characters").isLength({min : 3}),
],signup);

router.post('/signin',[
    body("email","email is required").isEmail(),
    body("password", "Password must be atleast 3 characters").isLength({min: 3})
],signin);

router.get('/signout',signout);
router.get('/testroute',isSignedIn, (req,res)=>{
    //res.send("A testroute tested");
    res.json(req.auth);
});

module.exports = router;