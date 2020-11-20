const{Order} = require('../models/order');

exports.getOrderbyId = (req,res,next,_id)=>{
    Order.findById(_id)
    .populate("products.product", "name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error : "Can't find the order"
            });
        }
        req.order = order;
        next();
    })
}
exports.createOrder = (req,res)=>{
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                error : "Failed to save order in db"
            });
        }
        res.json(order);
    })
}
exports.getAllOrders = (req,res)=>{
    Order.find()
    .populate("user", "_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error : "Failed to retreive all the order"
            });
        }
        res.json(order);
    })
}