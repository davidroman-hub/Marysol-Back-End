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

//// category remove method ////

exports.remove = (req,res)=>{
    const category = req.category;
    category.remove((err,data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json({
            message:"Categoria eliminada con éxito."
        })
    })
}


//// update category ////

exports.update = (req, res)=> {
    const category = req.category
    category.name = req.body.name
    category.save((err, data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            });
        }
        res.json(data);
    });
};


//// category list method for show all of the categories ////

exports.list = (req,res)=>{
    Category.find().exec((err,data)=>{
        if(err) return res.status(400)({
            error:errorHandler(err)
        })
        res.json(data)
    })
}