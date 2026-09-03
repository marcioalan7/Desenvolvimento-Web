const sequelize = require('../config/bd')
const Filme = require('./filme.model')
const Artista = require('./artista.model')
const Diretor = require('./diretor.model')
const FichaTecnica = require('./fichaTecnica.model')

Filme.hasOne(
    FichaTecnica, {
        foreignKey: 'filmeId',
        as:'fichaTecnica'
    }
)

FichaTecnica.hasOne(
    Filme, {
        foreignKey: 'filmeId',
        as: 'filme'
    }
)

Diretor.hasMany(
    Filme, {
        foreignKey: 'diretorId',
        as: 'filmes'
    }
)

Filme.belongsTo(
    Diretor, {
        foreignKey: 'diretorId',
        as: 'diretor'
    }
)

Filme.belongsToMany(
    Artista, {
        through: 'FilmeArtista',
        foreignKey: 'filmeId',
        as: 'artistas'
    }
)
Artista.belongsToMany(
    Filme, {
        through: 'FilmeArtista',
        foreignKey: 'artistaId',
        as: 'filmes'
    }
)


module.exports = {
    Filme,
    Artista,
    Diretor,
    FichaTecnica
}