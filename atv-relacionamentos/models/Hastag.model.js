const  { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const Hastag = sequelize.define(
    'Hastag', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

module.exports = Hastag