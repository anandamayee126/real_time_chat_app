const express=require('express');
const messageRoute=express.Router();
const Message = require('../models/message')
const User = require('../models/user');
const Group = require('../models/group');
const Member = require('../models/member');
const middleware= require('../middlewares/auth');
const {uploadToS3} = require('../services/s3Services')
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

messageRoute.post('/addMessage',middleware,async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const message = req.body.message;
        const group = await Group.findByPk(groupId)
        const user = await group.getUsers({where :{id : req.user.id}})
        const member = user[0].member;
        const result = await member.createMessage({msg : message , groupId})
        return res.json(result);
    }catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
})

messageRoute.get('/getMessages/:groupId',middleware,async(req,res)=>{
    try {
        const id = req.params.groupId;
        const group = await Group.findByPk(id) // req.user.getGroups()
        console.log(group)
        const result = await group.getMessages();
        const member = await group.getUsers({where : {id : req.user.id}})
        if(member.length == 0 ){
            return res.status(401).json({msg :"unauthorized access"})
        }
        
        return res.json({ success: true, messages: result, member , id : member[0].member.id })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
})

messageRoute.post('/uploadFile/:groupId', upload.single('file'),middleware,async(req,res) => {
   
    try{
        const fileName =new Date() + req.file.originalname
        const mimeType = req.file.mimetype
        const fileData = req.file.buffer
        console.log('line 61')
        const data = await uploadToS3(fileData , fileName)
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId)
        const user = await group.getUsers({ where: { id: req.user.id } })
        const member = user[0].member
// return res.json(data)
        const message = await member.createMessage({msg : data.Location , type : mimeType , groupId})
        return res.json(message)
    }catch(e){
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })

    }
})
module.exports= messageRoute;