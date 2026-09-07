const { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const Autor = sequelize.define(
    'Autor', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

module.exports = Autor