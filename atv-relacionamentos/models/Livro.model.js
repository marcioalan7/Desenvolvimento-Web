const  { DataTypes } = require('sequelize')
const sequelize = require('../config/bd')

const Livro = sequelize.define(
    'Livro', {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        anoPublicacao: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)

module.exports = Livro