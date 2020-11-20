//const category = require('../models/category');
const Category = require('../models/category');

exports.getcategoryId = (req,res,next,_id)=>{
    Category.findById(_id).exec((err,category)=>{
        if(err){
            console.log(err);
            return res.status(400).json({
                error:"Category not found in DB"
            });
        }
        req.category = category;
        next();
    })
}
exports.createCategory = (req,res)=>{
    const category = new Category(req.body);
    category.save((err,category)=>{
        if(err){
            console.log(err);
            return res.status(400).json({
                error: "Not able to save category in DB"
            });
        }
        res.json({category});
    })
}
exports.getCategory = (req,res)=>{
    return res.json(req.category);
}
exports.getAllCategory = (req,res)=>{
    Category.find().exec((err,items)=>{
        if(err){
            return res.status(400).json({
                error: "No categories found"
            });
        }
        res.json(items);
    })
}
exports.updateCategory = (req, res) => {
    Category.findByIdAndUpdate(
        {_id:req.category._id},
        {$set: req.body},
        {new: true,useFindAndModify: false},
        (err,updatedCategory)=>{
            if(err){
                return res.status(400).json({
                    error: "Failed to update this Category"
            });
        }
        res.json(updatedCategory);
        }

    )
  };
exports.deleteCategory = (req,res)=>{
    const category = req.category;
    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({
                error: "Failed to delete this Category"
            });
        }
        return res.json({
            message: "Deletion Successful"
        });
    });
}