const jwt= require('jsonwebtoken');
const User= require('../models/user');
const dot_env= require('dotenv');
dot_env.config();

const authenticate= ((req,res,next) => {
    try{
        const token= req.header('Authorization');
        console.log("token",token);
        const user= jwt.verify(token,process.env.SECRETKEY) ;
        User.findByPk(user.userId).then((user) => {
            console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch((err) => { console.log(err)
        })
    }
    catch(err) {
        console.log(err)
        res.status(403).json({success: false});
    } 
})
module.exports= authenticate;