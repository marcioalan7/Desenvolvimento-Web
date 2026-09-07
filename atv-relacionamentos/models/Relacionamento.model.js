const sequelize = require('../config/bd')
const Pessoa = require('./Pessoa.model')
const Passaporte = require('./Passaporte.model')
const Autor = require('./Autor.model')
const Livro = require('./Livro.model')

Pessoa.hasOne(
    Passaporte, {
        foreignKey: 'pessoaId',
        as: 'passaporte'
    }
)

Passaporte.belongsTo(
    Pessoa, {
        foreignKey: 'pessoaId',
        as: 'pessoa'
    }
)

Autor.hasMany(
    Livro, {
        foreignKey: 'autorId',
        as: 'livros'
    }
)

Livro.belongsTo(
    Autor, {
        foreignKey: 'autorId',
        as: 'autor'
    }
)

module.exports = {
    Pessoa,
    Passaporte,
    Autor,
    Livro
}