
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