const express=require('express');
const groupRoute=express.Router();
const Message = require('../models/message')
const User = require('../models/user');
const Group = require('../models/group');
const Member = require('../models/member');
const middleware= require('../middlewares/auth');
const {Op}= require('sequelize');
// const AWS= require('aws-sdk');
const dotEnv= require('dotenv');
dotEnv.config();
var currentGroup=null;




groupRoute.post('/create',middleware,async(req,res) => {
    try{
        const name = req.body.name;
        console.log(req.user.name)
       const group  =await Group.create({name : name , admin : true})
       const member = await req.user.addGroup(group , {through : {admin : true}})
       return res.json({group , member})
    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg :"Internal server error"})
    }
})

groupRoute.get('/getGroups',middleware,async(req, res)=>{
    try{
        const groups =await req.user.getGroups();
        return res.json({groups,user_id:req.user.id})
    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg :"Internal server error"})
    }
})


groupRoute.get('/showAllGroup',middleware,async(req,res)=>{
    const userGroups = await req.user.getGroups({ attributes: ['id'] });
    const groupIds = userGroups.map(group => group.id);
    console.log(typeof(groupIds));  //object
    const groups = await Group.findAll({
      where: {
        id: {
          [Op.notIn]: groupIds
        }
      }
    });
    return res.json({success: true, groups:groups});
    // return res.json({member});
    // console.log(member);                         /// ekhane forEach grp chalate hobe
})

groupRoute.post('/getUsers',middleware,async(req, res)=>{
    const groupId= req.body.groupId;
    const member= await Member.findAll({where:{groupId:groupId}});
    const userIds= member.map(user=>user.userId);
    console.log("member group",userIds);
    const users= await User.findAll({where:{
        id:{
            [Op.notIn]:userIds
        }
    }})
    console.log("left users",users);
    return res.json({remainingUsers:users});
})

groupRoute.get('/allUsers/:groupId',middleware,async(req, res)=>{
    try{    
        const groupId = req.params.groupId
        const groups = await req.user.getGroups({where : { id : groupId}
        })
        if(groups.length == 1 ){
            const group = groups[0]
            const users = await group.getUsers({
                attributes : ['id','name']})
              return res.json(users)
        }else{
            return res.status(403).json({msg :"You are not part of the group"})

        }
    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg :"Internal server error"})
    }
})

groupRoute.post('/currentGroup',middleware,async(req,res) => {
    const groupId= req.body.groupId;
    currentGroup= await Group.findByPk(groupId);
    return res.json({currentGroup});
})

groupRoute.get('/ifAdmin',middleware,async(req,res) => {
    console.log("Current Group",currentGroup);
    const groupid= currentGroup.id;
    const userid= req.user.id;
    console.log("abcde",userid);
    const member= await Member.findOne({where:{groupId:groupid}});
    console.log("abcde",member);
    console.log(member.dataValues.userId== userid)
    if(member.dataValues.userId== userid) {
        return res.json({success:true});
    }
    return res.json({success:false});
})

groupRoute.post('/joinGroup',middleware,async(req, res)=>{
    const groupId= req.body.group_id;
    const group= await Group.findByPk(groupId);
    const member= await group.addUser(req.user);
    console.log("group",group);
    console.log("member",member);
    return res.json({sucess: true,member: member, group: group});
})

groupRoute.get('/suggestedMembers',middleware,async(req, res)=>{
    const userId= req.user.id;
    console.log(userId);
    const users= await User.findAll({where:{
        id:{
          [Op.ne]:userId
    }}})
    return res.json({sucess: true,users:users});
})


groupRoute.post('/removeUser',middleware,async(req,res)=>{
    const userid= req.body.userId;
    const groupid= req.body.groupId;
    const group= await Group.findByPk(groupid);
    const member= await group.getUsers({userid});
    console.log("remove",member);
    const removeUser= await Member.destroy({where:{userId:userid,groupId:groupid}});
    return res.json({sucess: true,removed:removeUser});
    
})
groupRoute.post('/addUser',middleware,async(req,res)=>{
    const groupId= req.body.groupId;
    console.log(groupId);
    const userId= req.body.userId;
    const group= await Group.findByPk(groupId);
    const member= await group.addUser(userId);
    console.log("tfgh",member);
    return res.json({success:true,data:member})
})
module.exports= groupRoute;



