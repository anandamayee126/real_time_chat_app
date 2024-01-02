const Sequelize = require('sequelize');
const sequelize = require('../util/db');
const ArchievedMessage= sequelize.define('archivedmessaage',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    msg:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports= ArchievedMessage;