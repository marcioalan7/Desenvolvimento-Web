const {DataTypes} = require('sequelize');
const sequelize = require('../config/bd');

const Ficha = sequelize.define(
    'Ficha',
    {
    duracao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    orcamento: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    bilheteria: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
    }
)

module.exports = Ficha;