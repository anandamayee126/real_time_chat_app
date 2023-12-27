const express=require('express');
const msg_route=express.Router();
const Message = require('../models/message')
const User = require('../models/user');
const Group = require('../models/group');
const Member = require('../models/member');

msg_route.post('/add-message',async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const message = req.body.message;
        const group = await Group.findByPk(groupId)
        const user = await group.getUsers({where :{id : req.user.id}})
        const member = user[0].member;
        const result = await member.createMessage({message , groupId})
        return res.json(result);
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
})

msg_route.get('/get-messages/:groupId',async(req,res)=>{
    try {
        const id = req.params.groupId;
        const group = await Group.findByPk(id)
        const member = await req.user.getGroups({where : {id }})
        if(member.length == 0 ){
            return res.status(401).json({msg :"unauthorized access"})
        }
        const result = await group.getMessages();
        return res.json({ success: true, messages: result, id: member[0].member.id })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
})

module.exports= msg_route;