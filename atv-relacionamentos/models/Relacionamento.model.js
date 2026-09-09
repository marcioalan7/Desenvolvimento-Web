const sequelize = require('../config/bd')
const Pessoa = require('./Pessoa.model')
const Passaporte = require('./Passaporte.model')
const Autor = require('./Autor.model')
const Livro = require('./Livro.model')
const Categoria = require('./Categoria.model')
const Criador = require('./Criador.model')
const Video = require('./Video.model')
const PerfilCriador = require('./perfilCriador.model')
const Hastag = require('./Hastag.model')

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

Categoria.belongsToMany(
    Livro, {
        through: 'CategoriaLivro',
        foreignKey: 'categoriaId',
        as: 'livros'
    }
)

Livro.belongsToMany(
    Categoria, {
        through: 'CategoriaLivro',
        foreignKey: 'livroId',
        as: 'categorias'
    }
)

Criador.hasMany(
    Video, {
        foreignKey: 'criadorId',
        as: 'videos'
    }
)

Video.belongsTo(
    Criador, {
        foreignKey: 'criadorId',
        as: 'criador'
    }
)

Criador.hasOne(
    PerfilCriador, {
        foreignKey: 'criadorId',
        as: 'perfil'
    }
)

PerfilCriador.belongsTo(
    Criador, {
        foreignKey: 'criadorId',
        as: 'criador'
    }
)

Video.belongsToMany(
    Hastag, {
        through: 'VideoHastag',
        foreignKey: 'videoId',
        as: 'hastags'
    }
)

Hastag.belongsToMany(
    Video, {
        through: 'VideoHastag',
        foreignKey: 'hastagId',
        as: 'videos'
    }
)

module.exports = {
    Pessoa,
    Passaporte,
    Autor,
    Livro,
    Categoria,
    Criador,
    Video,
    PerfilCriador,
    Hastag
}