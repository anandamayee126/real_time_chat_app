const express= require('express');
const app= express();
const cors= require('cors');
const User = require('./models/user');
const Message = require('./models/message');
const router = require('./routes/router');
const Sequelize= require('./util/db');


User.hasMany(Message);
Message.belongsTo(User);

app.use(cors());
app.use(express.json());
app.use('/user',router);


Sequelize.sync().then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
})