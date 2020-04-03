
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs')
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler')

//// find product by id method ////

exports.productById = (req,res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err|| !product){
            return res.status(400).json({
                error: 'Producto no encontrado'
            })
        }
        req.product = product;
        next()
    });
};

//// read the product method ////

exports.read = ( req, res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}





//// create product method ////

exports.create = (req,res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err,fields,files) => {

            if(err){
                return res.status(400).json({
                    error:'La imagen no pudo ser cargada'
                })
            }

            //All the filds need to be required..

            const {name, description, price, category,shipping, quantity} = fields
            if(!name || !description || !price || !category || !shipping || !quantity){
                return res.status(400).json({
                    error:'Todos los campos son necesarios..'
                })
            }

                let product = new Product(fields)

                if(files.photo){
                //we need to only accept photos with less than 1mb.
                    if(files.photo.size > 1000000){
                       return res.status(400).json({
                           error:'La imagen debe ser menos de 1 mb'
                       }) 
                    }
                    product.photo.data = fs.readFileSync(files.photo.path)
                    product.photo.contentType = files.photo.type
                }

                product.save((err,result)=>{
                    if(err){
                        return res.status(400).json({
                            error:errorHandler(error)
                        })
                    }

                    res.json(result)

                })
          })

        }

//// delate product ////

exports.remove = (req, res) => {
    let product = req.product
        product.remove((err, deletedProduct)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                });
            }
            res.json({
            //    deletedProduct,
             "message":"Product deleted succesfully"
            })
        })
    }    

//// update product method ////

exports.update = (req,res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err,fields,files) => {

            if(err){
                return res.status(400).json({
                    error:'La imagen no pudo ser cargada'
                })
            }

            //All the filds dont need to be required its update..

            // const {name, description, price, category,shipping, quantity} = fields
            // if(!name || !description || !price || !category || !shipping || !quantity){
            //     return res.status(400).json({
            //         error:'Todos los campos son necesarios..'
            //     })
            // }

                let product = req.product;  
                product = _.extend(product,fields)

                if(files.photo){
                //we need to only accept photos with less than 1mb.
                    if(files.photo.size > 1000000){
                       return res.status(400).json({
                           error:'La imagen debe ser menos de 1 mb'
                       }) 
                    }
                    product.photo.data = fs.readFileSync(files.photo.path)
                    product.photo.contentType = files.photo.type
                }

                product.save((err,result)=>{
                    if(err){
                        return res.status(400).json({
                            error:errorHandler(error)
                        })
                    }

                    res.json(result)

                })
          })

        }

//// when we have the appication, we need to show the products at the store, in this case we
/// can use the mthods as amazon, if you see the show the most popular products or in this case
// the products whit more sells,, we gonna do the same with this whit the next methods
/// returning the wuerys of the same products deppending the new arrivals or the mos popular:

///sell /// arrival///

///products by sell:
            // for see the results in postmand after the url 
// sell = /products?sortBy=sold&order=desc&limit=4   <--this only will show me the 4 prodcts more sold


// we want to return the product  by sell = /products?sortyBy=sold&order=desc&limit=4

//by arrival = /products?sortyBy=createAt&order=desc&limit=4

//if the params will not send, then all the prodcs are returned

exports.list = (req, res) => {

    let order = req.query.order ? req.query.order:'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy: '_id'
    let limit = req.query.limit ? parseInt(req.query.limit): 6 

    Product.find()
    .select("-photo")
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,products) => {
        if (err){
            return res.status(400).json({
                error:'Producto no encontrado'
            })       
         } res.send(products)
    });

}


/**
 * Now we need to show the related products or another products
 * as the same case, so we need to create another list showing 
 * the products with the same category 
 */

 exports.listRelated = ( req, res) => {
     let limit = req.query.limit ? parseInt(req.query.limit): 6;
     
      //we need to create a method to find the related categories  from the product so,
     //if we gonna use a product to find the related 
     //products we can't  use the same product.(not including it self)
    
     Product.find({_id:{$ne:req.product}, category:req.product.category})
     .limit(limit)
     .populate('category','_id name')
     .exec((err,products)=>{
         if(err){
             return res.status(400).json({
                 error:"Productos no encontrados"
             })
         }
         res.json(products)
     })
 
    }


    //// List product Categories ////

    
exports.listCategories = (req, res) => { 
    Product.distinct("category", {} ,(err, categories)=> {
        if(err){
            return res.status(400).json({
                error:"Category not found"
            })
        }
        res.json(categories)
    })
}
    

/// List products by search ///

/*
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */




exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
}; 

//for visualizing use a web-browser http://localhost:8000/api/product/photo/5e25d6f4159d2428ec504517

exports.photo = (req, res, next) => {
    if (req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

/// list search ///

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query ={}
    //asign search value to query.name
    if(req.query.search){
        query.name = {$regex:req.query.search, $options:'i' }
        // assigne category value to query.category
        if(req.query.category && req.query.category != 'All' ){
            query.category =req.query.category
        }
            // find the product badsed on query object with 2 properties
            //search and category
    
            Product.find(query, (err, products)=> {
                if(err){
                    return res.status(400).json({
                        error:errorHandler(err)
                    })
                }
                res.json(products)
             }). select('-photo')
        }
    }


    /// update sold products quantity

    exports.decreaseQuantity =( req, res, next) => {
        let bulkOps = req.body.order.products.map((item)=>{
            return{
                updateOne:{
                    filter:{_id: item._id},
                    update:{$inc:{quantity: -item.count, sold: +item.count }}
                }
            }
        })
    
        Product.bulkWrite(bulkOps,{},(error,products)=>{
            if(error){
                res.status(400).json({
                    error:'Could not update product'
                });
            }
            next();
        });
    };
    