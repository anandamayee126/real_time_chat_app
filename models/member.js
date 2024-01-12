const sequelize = require('../utils/db')
const Sequelize = require('sequelize')
const Member = sequelize.define('member' , {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey :true,
        allowNull:false
    },
    admin : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
    }
})

module.exports = Member