// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const { ObjectId } = mongoose.Schema;
 
// const CartItemSchema = new mongoose.Schema(
//   {
//     product: { type: ObjectId, ref: "Product" },
//     name: String,
//     price: Number,
//     count: Number
//   },
//   { timestamps: true }
// );
 
// const CartItem = mongoose.model("CartItem", CartItemSchema);
 
// const OrderSchema = new mongoose.Schema(
//   {
//     products: [CartItemSchema], // before was products but in the front end i have this like product
//     transaction_id: {},
//     amount: { type: Number },
//     address: String,
//     status: {
//       type: String,
//       default: "No Procesado",
//       enum: ["No Procesado", "Procesando", "Enviado", "Entregado", "Cancelado"] // enum means string objects
//     },
//     updated: Date,
//     user: { type: ObjectId, ref: "User" }
//   },
//   { timestamps: true }
// );
 
// const Order = mongoose.model("Order", OrderSchema);
 
// module.exports = { Order, CartItem };
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;
 
const CartItemSchema = new mongoose.Schema(
  {
    product: { type: ObjectId, ref: "Product" },
    name: String,
    price: Number,
    count: Number
  },
  { timestamps: true }
);
 
const CartItem = mongoose.model("CartItem", CartItemSchema);
 
const OrderSchema = new mongoose.Schema(
  {
    products: [CartItemSchema], // before was products but in the front end i have this like product
    
    number: {},
    client_email:{},
    client_address:{},
    client_address2:{},
    client_name:{},
    client_phone:{},
    client_id:{},
    details: {},
    amount: { type: Number },
    address: String,
    address2: String,
    status: {
      type: String,
      default: "No procesado",
      enum: ["No procesado", "Recibido y procesando", "Enviado", "Entregado", "Cancelado"] // enum means string objects
    },
    updated: Date,
     user: { type: ObjectId, ref: "User" }
  },
  { timestamps: true }
);
 
const Order = mongoose.model("Order", OrderSchema);
 
module.exports = { Order, CartItem };