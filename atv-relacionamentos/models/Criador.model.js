const { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const Criador = sequelize.define(
    'Criador', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nomeUsuario: {
            type: DataTypes.STRING,
            allowNUll: false
        },
        seguidores:{
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }
)

module.exports = Criador