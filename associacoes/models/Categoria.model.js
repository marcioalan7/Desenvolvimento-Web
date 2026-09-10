const { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const Categoria = sequelize.define(
    'Categoria', {
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

module.exports = Categoria