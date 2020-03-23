const User = require('../models/user')

// the method to get the information of the user

exports.read = (req,res) => {
    const userId = req.params.id
    User.findById(userId).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error:'User not found'
            })
        } 
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    })
}

// update methods for the user

exports.update = (req, res) => {
    // console.log('Update user - req.user', req.user, 'update-data ', req.body) <-- this is for see whats we are sending

const {name, password} = req.body 

User.findOne({_id: req.user._id},(err,user)=>{
    if(err || !user){
       return res.status(400).json({
            error: 'User not found'
            })
        }
        if(!name){
            res.status(400).json({
                error: 'Name is required'
            })
        } else {
            user.name = name
        }
        
        if(password){
            if(password.length < 6 ){
                res.status(400).json({
                    error: 'Password must have at least 6 characters'
                })
            } else {
                user.password = password
            }
        }

        user.save((err, updatedUser) =>{
            if(err){
                console.log('User update error', err)
                res.status(400).json({
                    error:'User updated failed'
                })
            }
            updatedUser.hashed_password = undefined
            updatedUser.salt = undefined
            res.json(updatedUser)
        })
    });
};