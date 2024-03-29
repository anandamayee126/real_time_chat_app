const express= require('express');
const router= express.Router();
const User= require('../models/user');
const Message= require('../models/message');
const Member= require('../models/member');
const Group= require('../models/group');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotEnv= require('dotenv');
const middleware = require('../middlewares/auth');
dotEnv.config();
const {Op}= require('sequelize');

var userId=0;
var userName=null;
var token=null;
function tokenCreation(userId)
{
    return jwt.sign({userId:userId},process.env.SECRET_KEY);    ////////////////
}

router.post('/signup',async(req,res) => {
    const name= req.body.name;
    const email= req.body.email;
    const number= req.body.phone;
    const password= req.body.password;
    
    
    const exist= await User.findOne({where: {email:email}});
    if(exist!=null){
        res.json({success: false,message:'already exists'});
    }
    else{
        const saltRounds=10;
        bcrypt.hash(password, saltRounds,async(err,hash) => {
        console.log(err);
        const newUser= await User.create({name:name,email:email,phoneNumber:number,password:hash});
       // userId=newUser.id;
        res.json({success: true,message:'new user registered'});
       })
    }
})

router.post('/login',async(req,res)=>{
    try{
        const email= req.body.email;
        const password= req.body.password;
        const exist_email= await User.findOne({where: {email:email}});

        if(exist_email==null){
            alert("User not found .... Please signup first")
            res.json({success:false, status:404, message:"User not found .... Please signup first"});
        }
        else{
            console.log(exist_email);
            userId=exist_email.id;
            console.log("userId: ",userId);
            userName=exist_email.name;
            console.log("existEmail",userName);
            token= tokenCreation(userId);
            bcrypt.compare(password,exist_email.password,(err,result)=>{
                if(err){
                    res.json({success:false,message:"Something went wrong"});
                }
                else if(result===true){
                    return res.json({success:true,token,message:"User login successfull"});
                }
                else{
                    res.status(403).json({success:false,message:"incorrect password"});
                }
            })
        }
    }
    catch(e){
        console.log(e);
    }
})

router.get('/showId',middleware,async(req,res)=>{
    const userName= await User.findByPk(req.user.id);
    console.log("efgh",userName.dataValues);
    return res.json({userId,user:userName.dataValues});
     
})

// router.post('/chat',middleware,async(req, res)=>{
//     try{
//         const msg= req.body.message;
//         const send= await req.user.createMessage({msg:msg});
//         console.log("send",send);
//         res.json({success:true,message:send});        
//     }
//     catch(err){
//         console.log(err);
//     }
// })

router.get('/all-users',middleware,async(req, res)=>{
    try{
        const users= await User.findAll(
        //     id:{
        //         [Op.lte] : req.user.id
        //     }
        // }
    );
        return res.json({users});
    }
    catch(err){
        console.log(err);
    }
})

// router.get('/all-messages',middleware,async(req, res)=>{
//     try{
//         const messages= await Message.findAll({
//             include:{
//                 model: User
//             }
//         })
//         return res.json({messages});
//     }
//     catch(err){
//         console.log(err);
//     }
// })

module.exports = router;