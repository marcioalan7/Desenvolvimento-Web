const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

const sequelize = require('./config/bd')
const methodOverride = require('method-override')

const Produto = require('./models/Produto.model')
const Categoria = require('./models/Categoria.model')
const Vendedor = require('./models/Vendedor.model')

require('./models/Relacionamentos.model')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.engine(
    'handlebars',
    exphbs.engine({ defaultLayout: false })
)

app.set(
    'view engine',
    'handlebars'
)

app.get(
    '/',
    async (req, res) => {
        res.render('home')
    }
)

app.get(
    '/cadastrarProduto',
    async(req, res) => {
        const vendedores = await Vendedor.findAll({ raw: true })
        const categorias = await Categoria.findAll({ raw: true })
        res.render('cadastrarProduto', { categorias: categorias, vendedores: vendedores })
    }
)

app.post(
    '/cadastrarProduto',
    async(req, res) => {
        try {
            const { nome, preco, quantidade, categoriaId, vendedores } = req.body
            const produto = await Produto.create({ nome, preco, quantidade, categoriaId })
            await produto.setVendedores(vendedores)
            console.log('Produto inserido!')
            res.redirect('/produtos/' + produto.id)
        } catch (erro) {
            console.error('Produto não cadastrado!', erro)
            res.status(404).send('Erro ao cadastrar!')
        }
    }
)

app.get(
    '/produtos/:id',
    async(req, res) => {
        const id = req.params.id
        const produto = await Produto.findByPk(id, {
            include: [
                {
                    model: Categoria,
                    as: 'categoria'
                },
                {
                    model: Vendedor,
                    as: 'vendedores'
                }
            ]
        })

        res.render('detalharProduto', { produto: produto.toJSON() })
    }
)

app.get(
    '/cadastrarCategoria',
    async(req, res) => {
        res.render('cadastrarCategoria')
    }
)

app.post(
    '/cadastrarCategoria',
    async(req, res) => {
        try {
            const { tipo } = req.body
            const categoria = await Categoria.create({ tipo })
            console.log('Categoria inserida!')
            res.redirect('/categorias')
        } catch (erro) {
            console.error('Categoria não cadastrada!', erro)
            res.status(404).send('Erro ao cadastrar!')
        }
    }
)

app.get(
    '/categorias',
    async(req, res) => {
        const categorias = await Categoria.findAll({ raw: true })
        res.render('categorias', { categorias })
    }
)

app.get(
    '/categorias/:id',
    async(req, res) => {
        const id = req.params.id
        const categoria = await Categoria.findByPk(id, {
            include: [
                {
                    model: Produto,
                    as: 'produtos'
                }
            ]
        })
        res.render('detalharCategoria', { categoria: categoria.toJSON() })
    }
)

app.get(
    '/vendedores',
    async(req, res) => {
        const vendedores = await Vendedor.findAll({ raw: true })
        res.render('vendedores', { vendedores })
    }
)

app.get(
    '/cadastrarVendedor',
    async(req, res) => {
        res.render('cadastrarVendedor')
    }
)

app.post(
    '/cadastrarVendedor',
    async(req, res) => {
        const { nome } = req.body
        const vendedor = await Vendedor.create({
            nome
        })
        res.redirect('/vendedores')
    }
)

app.get(
    '/vendedores/:id',
    async(req, res) => {
        const id = req.params.id
        const vendedor = await Vendedor.findByPk(id, {
            include: [
                {
                    model: Produto,
                    as: 'produtos'
                }
            ]
        })
        res.render('detalharVendedor', { vendedor: vendedor.toJSON() })
    }
)



async function conectarBD(){
    try {
        await sequelize.sync({ alter: true })
        console.log('Conexão estabelecida!')
    } catch (erro) {
        console.error('Erro na conexão!', erro)
    }
}

conectarBD()

app.listen(
    3000,
    () => console.log('Servidor rodando!')
)