const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler')


//// find category by id ////

exports.categoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,category)=>{
        if(err||!category){
            return res.status(400).json({
                error:" La categoria no existe"
            })
        }
        req.category = category
        next()
    })
}

//// read method of category ////
exports.read = (req,res) => {
    return res.json(req.category)
}


//// create category method //// 
exports.create = (req,res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({data})
    })
} 