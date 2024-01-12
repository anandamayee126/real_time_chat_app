const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const Message= sequelize.define('message',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    msg:{
        type: Sequelize.STRING,
        allowNull: false
    },
    type : {
        type : Sequelize.STRING,
        allowNull : false,
        defaultValue : "text"
    }
})

module.exports= Message;