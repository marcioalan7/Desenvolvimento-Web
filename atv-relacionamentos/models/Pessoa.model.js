const { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const Pessoa = sequelize.define (
    'Pessoa', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

module.exports = Pessoa