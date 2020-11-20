const User = require('../models/user');
const Order = require('../models/order')

exports.getUserbyId = (req,res,next,id)=> {
    User.findById(id).exec((err,user)=> {
        if(err || !user){
            res.status(400).json({
                error: "No User was found is DB"
            });
        }
        req.profile = user;
        next();
    })
}

exports.getUser = (req,res)=>{
    //TODO: get back here for password
    req.profile.salt = undefined;
    req.profile.encry_password = "";
    req.profile.timestamps = "";
    return res.json(req.profile);
}
// exports.getallUser = (req,res)=>{
//     User.find({},(err,user)=>{
//         if(err || !user){
//             console.log(err);
//             res.status(400).json({
//                 error: "Cannot get any user"
//             });
//         }
//         req.profile = user;
//         return res.json(req.profile);
//     })
// }
exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true,useFindAndModify: false},
        (err,user)=>{
            if(err){
                console.log(err);
                return res.status(400).json({
                    error: "You are not authorized to update in DB"
                });
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user);
        }
    )
}
exports.userPurchaseList = (req,res,next)=>{
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error: "No order in this account"
            });
        }
        return res.json(order);
        next();
    });
}
exports.pushOrderinPurchaseList = (req,res,next)=>{
    let purchases=[];
    req.body.order.products.forEach(element => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amaount,
            transaction_id: req.body.order.transaction_id
        })
    });
    //store in db
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchase:purchase}},
        {new: true},
        (err,purchase)=>{
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchaselist"
                });
            }
        }

    )
    next();
}