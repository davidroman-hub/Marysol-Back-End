const express = require('express')
const router = express.Router()

// import controller

const{ signup, 
    accountActivation,
    signin,
    forgotPassword,
    resetPassword,
    googleLogin, 
    facebookLogin

    } = require('../controllers/auth')


// import validators
const {userSignupValidator, userSigninValidator, forgotPasswordValidator,resetPasswordValidator} =require('../validators/auth')
const {runValidation} =require('../validators/index')

router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/signin', userSigninValidator, runValidation, signin)
router.post('/account-activation', accountActivation)

// forgot reste password // 
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword,)
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword,)

/// google and facebook auth

router.post('/google-login', googleLogin)
router.post('/facebook-login', facebookLogin)



module.exports = router // {}