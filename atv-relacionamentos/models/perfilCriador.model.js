const { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const PerfilCriador = sequelize.define(
    'PerfilCriador', {
        bio: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fotoUrl: {
            type: DataTypes.STRING,
            allowNUll: false
        },
        linkRedeSocial: {
            type: DataTypes.STRING,
        }
    }
)

module.exports = PerfilCriador