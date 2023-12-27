const express=require('express');
const group_route=express.Router();
const Message = require('../models/message')
const User = require('../models/user');
const Group = require('../models/group');
const Member = require('../models/member');

group_route.post('/create',async(req,res) => {
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

group_route.get('/get-groups',async(req, res)=>{
    try{
        const groups =await req.user.getGroups()
        return res.json(groups)
    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg :"Internal server error"})
    }
})

group_route.get('/join-group/:groupId',async(req,res) => {
    try{
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId)
        if(group){
            const member = await group.addUser(req.user)
            return res.json(member)
        }else{
            return res.status(404).json({msg :"Group does not exist"})
        }

    }catch(e){
        console.log(e)
        return res.status(500).json({success : false , msg :"Internal server error"})
    }
})

group_route.get('/all-users/:groupId',async(req, res)=>{
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

module.exports= group_route;