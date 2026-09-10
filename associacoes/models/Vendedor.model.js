const { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const Vendedor = sequelize.define(
    'Vendedor', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

module.exports = Vendedor