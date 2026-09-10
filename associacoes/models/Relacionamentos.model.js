const Produto = require('./Produto.model')
const Categoria = require('./Categoria.model')
const Vendedor = require('./Vendedor.model')

Categoria.hasMany(
    Produto, {
        foreignKey: 'categoriaId',
        as: 'produtos'
    }
)

Produto.belongsTo(
    Categoria, {
        foreignKey: 'categoriaId',
        as: 'categoria'
    }
)

Produto.belongsToMany(
    Vendedor, {
        through: 'ProdutoVendedor',
        foreignKey: 'produtoId',
        as: 'vendedores'
    }
)

Vendedor.belongsToMany(
    Produto, {
        through: 'ProdutoVendedor',
        foreignKey: 'vendedorId',
        as: 'produtos'
    }
)

module.exports = {
    Produto,
    Categoria,
    Vendedor
}