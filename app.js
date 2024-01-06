const express= require('express');
const app= express();
const cors= require('cors');
const User = require('./models/user');
const Message = require('./models/message');
const ArchievedMessage= require('./models/archievedChats');
const router = require('./routes/router');
const Sequelize= require('./util/db');
const Group = require('./models/group');
const Member = require('./models/member');
const message_router= require('./routes/message_route');
const group_router= require('./routes/group_route');
const cron= require('node-cron');
const {Op}= require('sequelize');


const AWS=require('aws-sdk')
const socket= require('socket.io');
const multer=require('multer');
// // const { io } = require('socket.io-client');
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });
app.use(
    cors()
);
User.belongsToMany(Group , {through : Member})
Group.belongsToMany( User, {through : Member})

Group.hasMany(Message)
Message.belongsTo(Group)

Member.hasMany(Message)
Message.belongsTo(Member)


app.use(express.static('frontend'))
app.use(express.json());
app.use('/user/filesharing/:token',upload.single('file'),(req,res,next)=>{
    req.body.token=req.params.token;
    next()
  })
app.use('/message',message_router);
app.use('/group',group_router);
app.use('/user',router);

cron.schedule('0 0 * * *',async ()=>{
    try{
      const curdate=new Date();
      const checkdate=new Date(curdate.getFullYear(),curdate.getMonth(),curdate.getDate,0,0,0);  // why 0 0 0 at the end
      Message.findAll({where:{createdAt:{[Op.lte]:checkdate}}})
        .then(allchat=>{
          for (const chat of allchat) {
            ArchievedMessage.create(chat.toJSON());
            chat.destroy();
          }
        });
        console.log('doing clean')
  
  
    }catch(err){
      console.log(err)
    }
  
  },
  {
  timezone:'Asia/Kolkata',
  
  })

const port=3000;
let server;
Sequelize.sync().then(() => {
    server= app.listen(port, () => console.log(`Server running on port ${port}`))
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id)
    
        socket.on("NewMessageAdded",(data)=>{
            console.log("new message added");
            io.emit('NewMessageAdded',data)
        })
    
        socket.on("NewUserJoined",()=>{
            console.log("new user joined");
            io.emit('NewUserJoined')
        })

        socket.on("usermessaged",()=>{
            console.log("user messaged");
            io.emit("usermessaged")
        })
    })
}).catch(err => {
    console.log(err);
})


