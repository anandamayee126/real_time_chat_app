const jwt= require('jsonwebtoken');
const User= require('../models/user');
const dotEnv= require('dotenv');
dotEnv.config();

const authenticate= ((req,res,next) => {
    try{
        const token= req.header('Authorization');
        console.log("token",token);
        const user= jwt.verify(token,process.env.SECRET_KEY) ;
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