const { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const Video = sequelize.define(
    'Video', {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

module.exports = Video