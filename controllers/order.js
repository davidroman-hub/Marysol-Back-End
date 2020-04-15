const { Order, CartItem } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// order by id method

exports.orderById = ( req, res, next, id) => {
    Order.findById(id)
    .populate('products.product','name price')
    .exec((err, order) => {
            if(err || !order){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            req.order = order
            next();
    })
}


// create order method


// exports.create =(req, res) => {
//     console.log('CREATE ORDER: ', req.body);
//    req.body.order.user = req.profile;
//    const order = new Order(req.body.order);
//    order.save((error, data)=>{
//        if(error){
//            return res.status(400).json({ 
//                error: errorHandler(error)
//            })
//        }
//        res.json(data)
//    })

// }

exports.create =(req, res) => {
    console.log('CREATE ORDER: ', req.body);
   req.body.order.user = req.profile;
   const order = new Order(req.body.order);
   order.save((error, data)=>{
       if(error){
           return res.status(400).json({ 
               error: errorHandler(error)
           })
       }
       console.log('ORDER IS JUST SAVED >>> ', order);
       const emailData = {
        to: process.env.EMAIL_ORDER, // admin
        from: process.env.EMAIL_FROM,
        subject: `Una nueva orden ha sido realizada!`,
        html: `
        <h1>Hey Administrador, Alguien acaba de realizar un pedido en Mar y Sol!</h1>
        <h2>Nombre del cliente: ${order.client_name}</h2>
        <h2>E-mail del cliente: ${order.client_email}</h2>
        <h2>Colonia de envío: ${order.address}</h2>
        <h2>Dirección: ${order.address2}</h2>
        <h2>Teléfono de Contacto: ${order.number}</h2>
        <h2>Total de productos: ${order.products.length}</h2>
        <h2>Status de la orden: ${order.status}</h2>
        <h2>Detalles de los Productos:</h2>
        <hr />
        ${order.products
            .map(p => {
                return `<div>
                    <h3>Nombre del producto: ${p.name}</h3>
                    <h3>Precio del producto: ${p.price}</h3>
                    <h3>Cantidad del producto ordenado: ${p.count}</h3>
            </div>`;
            })
            .join('--------------------')}
        <h2>Total: ${order.amount}<h2>
        <p>Entra al perfil de usuario de Mar y Sol</a> Para visualizar los detalles de la orden`

       }
       sgMail
       .send(emailData)
       .then(sent => console.log('SENT >>>', sent))
       .catch(err => console.log('ERR >>>', err));

        // email to buyer
        const emailData2 = {
            to: order.client_email,
            from: 'MarySol@cevicheria.com',
            subject: `Tu orden esta en proceso!!`,
            html: `
            <h1>Hey ${order.client_name}, Gracias por ordenar en Mar y Sol!</h1>
            <h2>Total de productos: ${order.products.length}</h2>
            <h2>Estatus de la orden: ${order.status}</h2>
            <h2>Colonia de envío: ${order.address}</h2>
            <h2>Dirección: ${order.address2}</h2>
            <h2>Teléfono de contacto: ${order.number}</h2>
            <h2>Detalles de los productos:</h2>
            <hr />
            ${order.products
                .map(p => {
                    return `<div>
                        <h3>Nombre del producto: ${p.name}</h3>
                        <h3>Costo del producto: ${p.price}</h3>
                        <h3>Cantidad ordenada: ${p.count}</h3>
                </div>`;
                })
                .join('--------------------')}
            <h2>Total de tu orden: ${order.amount}<h2>
            <p>Gracias por comprar con nosotros!</p>
        `
        };
        sgMail
            .send(emailData2)
            .then(sent => console.log('SENT 2 >>>', sent))
            .catch(err => console.log('ERR 2 >>>', err));
 
            res.json(data);
    })
}


 



//List orders to the front-end

exports.listOrders = (req, res) => {
    Order.find()
        .populate('user', '_id name address')
        .sort('-created')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(orders);
        });
};

// enum status values method

exports.getStatusValues = (req, res) => {
    res.json(Order.schema.path('status').enumValues)
}

//updateOrderStatus method

exports.updateOrderStatus = (req,res) => {
    Order.update({_id: req.body.orderId}, 
        {$set:{status: req.body.status}},
        (err,order) =>{
            if (err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(order)
        })
}