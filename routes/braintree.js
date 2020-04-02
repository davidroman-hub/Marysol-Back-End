const express = require('express');
const router = express.Router();

// need to be auth and signin thats why we used the middleware here
const {requireSignin, isAuth} = require('../controllers/auth')
//also we gonna use user controllers as well

const { generateToken, processPayment } = require('../controllers/braintree')


router.get('/braintree/getToken/:Id',
            requireSignin,
            generateToken )

router.post('/braintree/payment/:Id',
            requireSignin,
            processPayment )



module.exports = router