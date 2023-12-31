const express= require('express');
const app= express();
const cors= require('cors');
const User = require('./models/user');
const Message = require('./models/message');
const router = require('./routes/router');
const Sequelize= require('./util/db');
const Group = require('./models/group');
const Member = require('./models/member');
const message_router= require('./routes/message_route');
const group_router= require('./routes/group_route');

const AWS=require('aws-sdk')
const multer=require('multer')
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// User.hasMany(Message);
// Message.belongsTo(User);

User.belongsToMany(Group , {through : Member})
Group.belongsToMany( User, {through : Member})

Group.hasMany(Message)
Message.belongsTo(Group)

Member.hasMany(Message)
Message.belongsTo(Member)


app.use(cors());
app.use(express.static('frontend'))
app.use(express.json());
app.use('/user/filesharing/:token',upload.single('file'),(req,res,next)=>{
    req.body.token=req.params.token;
    next()
  })
app.use('/user',router);
app.use('/message',message_router);
app.use('/group',group_router);

const port=3000;
Sequelize.sync().then(() => {
    const server= app.listen(port, () => console.log(`Server running on port ${port}`))
    const io = require('socket.io')(server,{
        cors : {
            origin : ['http://localhost:3000']
        }
    });
    router(io);
}).catch(err => {
    console.log(err);
})