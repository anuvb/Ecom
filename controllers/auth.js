const User = require('../models/user');
const { body, validationResult } = require('express-validator');
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signout = (req,res)=>{
    return res.json({
        message: "User Signedout"
    });
}

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
      if(err || !user){
      console.log(err)
        return res.status(400).json({
            err: "NOT able to save user in DB"
        })
      }
      res.json({
        name: user.name,
        email: user.email,
        id: user._id
      });
    });
  };

exports.signin = (req,res)=>{
    const errors = validationResult(req);
    // if(errors){
    //     return res.status(422).json({
    //         error: errors.array()[0].msg
    //     });
    // };
    const {email,password} = req.body;
    User.findOne({email},(err,user)=>{
        if(err || !user){
            console.log(err);
            return res.status(400).json({
                error: "User doesnot exist"
            });
        }
        if(!user.autheticate(password)){
            return res.status(401).json({
                error: "Password don't match"
            });
        };
        //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
    });
}

exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.json({
        message: "User successfully signedout"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    //algorithms: ['RS256']
    algorithms: ['HS256']
});


//custom middlewares
exports.isAuthenticated = (req,res,next)=> {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        res.status(403).json({
            message: "ACCESS DENIED"
        });
    }
    
    next();
}
exports.isAdmin = (req,res,next)=> {
    if(req.profile.role===0){
        res.status(403).json({
            message: "You are not an Admin"
        });
    }
    next()
}