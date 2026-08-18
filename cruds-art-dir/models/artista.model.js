const {DataTypes} = require('sequelize');
const sequelize = require('../config/bd');

const Artista = sequelize.define(
    'Artista',
    {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    anoNascimento: {
        type: DataTypes.STRING,
        allowNull: false
    },

    foto: {
        type: DataTypes.STRING,
        allowNull: false
    },

    nomeArtistico: {
        type: DataTypes.STRING,
        allowNull: false
    },

    tecAtuacao: {
        type: DataTypes.STRING,
        allowNull: false
    },

    atv: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }

    }
)

module.exports = Artista;