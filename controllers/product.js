
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs')
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler')

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