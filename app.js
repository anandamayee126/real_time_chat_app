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


User.belongsToMany(Group , {through : Member})
Group.belongsToMany( User, {through : Member})

Group.hasMany(Message)
Message.belongsTo(Group)

Member.hasMany(Message)
Message.belongsTo(Member)



app.use(cors({
    origin: "http://127.0.0.1:5500"
    
}));
app.use(express.json());
app.use('/user',router);
app.use('/message',message_router);
app.use('/group',group_router);


Sequelize.sync({force:true}).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
})