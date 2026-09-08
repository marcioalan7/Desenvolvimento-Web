const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

const sequelize = require('./config/bd')
const methodOverride = require('method-override');

const Pessoa = require('./models/Pessoa.model')
const Passaporte = require('./models/Passaporte.model')
const Autor = require('./models/Autor.model')
const Livro = require('./models/Livro.model')
const Categoria = require('./models/Categoria.model')

require('./models/Relacionamento.model')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.engine(
    'handlebars', 
    exphbs.engine( {defaultLayout: false} )
);

app.set(
    'view engine', 
    'handlebars'
);

app.get(
    '/',
    async(req,res) => {
        res.render('home')
    }
)

app.get(
    '/cadastrarPessoa',
    async (req, res) => {
        const passaporte = await Passaporte.findAll ({ raw: true })
        res.render('cadastrarPessoa', { passaporte: passaporte })
    }
)

app.post(
    '/cadastrarPessoa',
    async (req, res) => {
        const { nome } = req.body
        try {
            console.log('Dados Recebidos!')
            const pessoa = await Pessoa.create({ nome })
            res.redirect('/pessoas')
        } catch (erro) {
            console.error('Falha no cadastro de pessoa!', erro)
            res.status(500).send('Erro ao inserir pessoa!')
        }
    }
)

app.get(
    '/pessoas',
    async(req, res) => {
        try{
            const pessoas = await Pessoa.findAll()
            const pessoasJSON = pessoas.map(pessoa => pessoa.toJSON())
            console.log('Dados encontrdos', pessoasJSON)
            res.render('pessoas', {
                pessoas: pessoasJSON
            })
        } catch (erro) {
            console.error('Falha ao ler pessoas!', erro)
            res.status(500).send('Erro ao ler pessoas!')
        }
    }
)

app.get(
    '/pessoa/:id',
    async (req, res) => {
        const id = req.params.id
        const pessoa = await Pessoa.findByPk(id, {
            include: [
                {
                    model: Passaporte, as:'passaporte'
                }
            ]
        }
    )
    res.render('detalharPessoa', {
        pessoa: pessoa.toJSON()
    })
    }
)

app.get( 
    '/cadastrarPessoa/:id/passaporte',
    async (req, res) => {
       const id = req.params.id
       const pessoa = await Pessoa.findByPk(id)
       res.render('cadastrarPassaporte', { pessoa: pessoa.toJSON() }) 
    }
)

app.post(
    '/cadastrarPessoa/:id/passaporte',
    async (req, res) => {
        const id = req.params.id
        const { numero, validade  } = req.body
        const pessoa = await Pessoa.findByPk(id)
        await pessoa.createPassaporte({
            numero: numero, 
            validade: validade
        })
        res.redirect('/pessoas')
    }
)

app.get(
    '/cadastrarAutorLivros',
    async (req, res) => {
        res.render('cadastrarAutorLivros')
    }
)

app.post(
    '/cadastrarAutorLivros', 
    async (req, res) => {
        try {
            const { nomeAutor, tituloLivro1, anoLivro1, tituloLivro2, anoLivro2 } = req.body
            const autor = await Autor.create({ nome: nomeAutor })
            await autor.createLivro({ titulo: tituloLivro1, anoPublicacao: anoLivro1 })
            await autor.createLivro({ titulo: tituloLivro2, anoPublicacao: anoLivro2  })
            console.log('Autor e livros cadastrados com sucesso!')
            res.redirect('/autoresLivros')
        } catch (erro) {
            console.error('Falha ao cadastrar autor e livros:', erro)
            res.status(500).send('Erro ao cadastrar autor e livros!')
        }
    }
)

app.get(
    '/autoresLivros', 
    async (req, res) => {
        try {
            const autores = await Autor.findAll({
                include: [
                    {
                        model: Livro,
                        as: 'livros'
                    }
                ]
            })
            const autoresJSON = autores.map(autor => autor.toJSON())
            res.render('autoresLivros', {
                autores: autoresJSON
        })
        } catch (erro) {
            console.error('Erro ao buscar autores e livros:', erro)
            res.status(500).send('Erro ao buscar autores e livros!')
        }
    }
)

app.get(
    '/cadastrarLivroCategorias',
    async (req, res) => {
        res.render('cadastrarLivroCategorias')
    }
)

app.post(
    '/cadastrarLivroCategorias',
    async (req, res) => {
        try {
            const { titulo, anoPublicacao, categoria1, categoria2 } = req.body
            const livro = await Livro.create({ titulo: titulo, anoPublicacao: anoPublicacao })
            const cat1 = await Categoria.create({ nome: categoria1 })
            const cat2 = await Categoria.create({ nome: categoria2 })

            await livro.addCategoria(cat1)
            await livro.addCategoria(cat2)
        
            res.redirect('/livroCategorias')
        } catch (erro) {
            console.log('Erro ao inserir livro e categorias!', erro)
            res.status(500).send('Erro ao inserir!')
        }
    }
)

app.get(
    '/livro/:id/categorias',
    async (req, res) => {
        try{
            const { id } = req.params.id
            const livro = await Livro.findByPk(id, {
                include: [
                    {
                        model: Categoria,
                        as: 'categorias'
                    }
                ]
            })

            if (!livro){
                return res.status(404).send('Livro não encontrado')
            }

            console.log('Livro encontrado!')
        } catch (erro) {
            console.error('Erro ao buscar livro e categorias:', erro)
            res.status(500).send('Erro ao buscar livro e categorias!')
        }
    }
)

app.get(
    '/cadastrarLivro', 
    async (req, res) => {
        try {
            const autores = await Autor.findAll({ raw: true })
            const categorias = await Categoria.findAll({ raw: true })
            res.render('cadastrarLivro', { autores: autores, categorias: categorias })
        } catch (erro) {
            console.error('Erro ao carregar formulário:', erro)
            res.status(500).send('Erro ao carregar formulário!')
        }
    }
)

app.post(
    '/cadastrarLivro', 
    async (req, res) => {
        try {
            const { titulo, anoPublicacao, autorId, categoriaIds } = req.body
            const livro = await Livro.create({ titulo: titulo, anoPublicacao: anoPublicacao, autorId: autorId })
            await livro.setCategorias(categoriaIds)
            console.log('Livro cadastrado com sucesso!')
            res.redirect('/livro/' + livro.id)
        } catch (erro) {
            console.error('Erro ao cadastrar livro:', erro)
            res.status(500).send('Erro ao cadastrar livro!')
        }
    }
)

app.get(
    '/livro/:id', 
    async (req, res) => {
        try {
            const id = req.params.id
            const livro = await Livro.findByPk(id, {
                include: [
                    {
                        model: Autor,
                        as: 'autor'
                    },
                    {
                        model: Categoria,
                        as: 'categorias'
                    }
                ]
            })

            if (!livro) {
            return res.status(404).send('Livro não encontrado!')
            }

            const livroJSON = livro.toJSON()

            console.log('Livro encontrado:')
            console.log(livroJSON)

            res.render('detalharLivro', {
                livro: livroJSON
            })
        } catch (erro) {
            console.error('Erro ao detalhar livro:', erro)
            res.status(500).send('Erro ao detalhar livro!')
        }
    }
)

async function conectarBD() {
    try{
        await sequelize.sync();
        console.log('Conexão com o banco de dados estabelecida com sucesso!')
    } catch (erro) {
        console.error('Erro ao conectar:', erro);
    }
}

conectarBD()

app.listen(
    3000,
    () => console.log('Servidor em execução')
)