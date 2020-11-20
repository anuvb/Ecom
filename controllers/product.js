const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { sortBy } = require('lodash');

exports.getProductbyId = (req,res,next,_id)=>{
    Product.findById(_id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            console.log(err);
            return res.status(400).json({
                error: "Cannot fetch Product_id"
            });
        }
        req.product = product;
        next();
    });
}
exports.createProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            console.log(err);
            return res.status(400).json({
                error:"Problem with Image"
            });
        }
        //destructure fields
        const { name,description,price,category,stock } = fields;
        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        //TODO: restrictions on field
        let product = new Product(fields);

        //handle file here
        if(file.photo){
            if(file.photo.size> 3000000){
                return res.status(400).json({
                    error: "File size within 3MB"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        //save to db
        product.save((err,product)=>{
            if(err){
                console.log(err);
                return res.status(400).json({
                    error: "Saving product in db failed"
                });
            }
            res.json(product);
        })
    })
}

exports.getproduct = (req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}
//middleware
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}
exports.deleteProduct = (req,res)=>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error:"Failed deletion of product"
            });
        }
        res.json({
            message: "Deletion was successful",
            deletedProduct
        });
    });
}
exports.updateProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            console.log(err);
            return res.status(400).json({
                error:"Problem with Image"
            });
        }

        //TODO: restrictions on field
        let product = req.product;
        product = _.extend(product,fields);

        //handle file here
        if(file.photo){
            if(file.photo.size> 3000000){
                return res.status(400).json({
                    error: "File size within 3MB"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        //save to db
        product.save((err,product)=>{
            if(err){
                console.log(err);
                return res.status(400).json({
                    error: "Updation failed"
                });
            }
            res.json(product);
        })
    })
}
exports.getallProduct = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit ): 8;
    let sortby = req.query.sortby ? req.query.sortby : "_id"; 
    Product.find()
    .select("-photo")
    .populate("Category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,allProduct)=>{
        if(err){
            return res.status(400).json({
                error: "No Product found"
            });
        }
        res.json(allProduct);
    })
}
exports.getAllUniqueCategories = (req,res)=>{
    Product.distinct("category",{},(err,categories)=>{
        if(err){
            return res.status(400).json({
                error: "No category found"
            });
        }
        res.json(categories);
    })
}
exports.updateStock = (req,res,next)=>{
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter :{_id : prod._id},
                update : {$inc : {stock: -prod.count, sold: +prod.count}}
            }
        }
    });
    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error: "Bulk operation faild"
            });
        }
        next();
    })
}