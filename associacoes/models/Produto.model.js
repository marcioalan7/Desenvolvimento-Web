const { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const Produto = sequelize.define (
    'Produto', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        preco: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }
)

module.exports = Produto