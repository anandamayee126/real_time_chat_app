const express= require('express');
const app= express();
const cors= require('cors');
const User = require('./models/user');
const Message = require('./models/message');
const ArchievedMessage= require('./models/archievedChats');
const router = require('./routes/router');
const Sequelize= require('./utils/db');
const Group = require('./models/group');
const Member = require('./models/member');
const messageRouter= require('./routes/messageRoute');
const groupRouter= require('./routes/groupRoute');
const cron= require('node-cron');
const {Op}= require('sequelize');

// var room=null;



app.use(
    cors()
);
User.belongsToMany(Group , {through : Member})
Group.belongsToMany( User, {through : Member})

Group.hasMany(Message)
Message.belongsTo(Group)

Member.hasMany(Message)
Message.belongsTo(Member)


// app.use(express.static('frontend'))
app.use(express.json());
// app.use('/user/filesharing/:token',upload.single('file'),(req,res,next)=>{
//     req.body.token=req.params.token;
//     next()
//   })
app.use('/message',messageRouter);
app.use('/group',groupRouter);
app.use('/user',router);

      // const curdate=new Date(); 
      // const checkdate=new Date(curdate.getFullYear(),curdate.getMonth(),curdate.getDate,0,0,0);  // why 0 0 0 at the end
      // console.log("date is:",curdate);
      // const chats= Message.findAll({where:{createdAt:{[Op.lte]:curdate}}}).then((chat)=>{
      //   console.log(chat);
      // }).catch((error)=>{
      //   console.log(error);
      // })
      // console.log(chats);


cron.schedule('0 0 * * *',async ()=>{
    try{
      console.log("inside cron")
      const curdate=new Date(); 
      const chats=await Message.findAll({where:{createdAt:{[Op.lt]:curdate}}})
          for (const chat of chats) {
            ArchievedMessage.create({msg:chat.dataValues.msg});
            chat.destroy();
          }
       
        console.log('Message table cleaned');
        // console.log(chats[0].dataValues);
    }catch(err){
      console.log(err)
    }
  },
  {
  timezone:'Asia/Kolkata',
  
  })

// const port=3000;
// let server;
Sequelize.sync().then(() => {
    // server= app.listen(port, () => console.log(`Server running on port ${port}`))
    // const io = require('socket.io')(server);
    // io.on('connection', (socket) => {
    //   socket.on('join-room' , (room,cb)=>{
    //     socket.join(room)
    //     cb()
    //   })
    //     console.log('Client connected:', socket.id)
    //     socket.on("NewMessageAdded",(data,room)=>{  //129 
    //         console.log("new message added"); 
    //         console.log("message is:",data);
    //         if(room === '')
    //         {
    //           socket.broadcast.emit('MessageRecieved',data)
    //           // alert(data);
    //         }
    //         else{
    //           socket.to(room).emit(`MessageRecieved`,data)
    //           // alert(room);
    //         }
    //         console.log(data);
    //     })
    // })
    app.listen(3000);
}).catch(err => {
    console.log(err);
})


/*

rooms : 
chat A : click frontend emit 'join-room' , backend on :
  socket.join(room)



*/