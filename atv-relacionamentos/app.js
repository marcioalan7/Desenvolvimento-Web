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
const Criador = require('./models/Criador.model')
const Video = require('./models/Video.model')
const PerfilCriador = require('./models/perfilCriador.model')
const Hastag = require('./models/Hastag.model')

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
        
            res.redirect('/livro/' + livro.id)
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
            const id = req.params.id
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
    '/livrosCategorias', 
    async (req, res) => {
        try {
            const livros = await Livro.findAll({
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
            const livrosJSON = livros.map(livro => livro.toJSON())

            console.log('Livros encontrados:')
            console.log(livrosJSON)

            res.render('livrosCategorias', {
                livros: livrosJSON
            })

        } catch (erro) {
            console.error('Erro ao buscar livros e categorias:', erro)
            res.status(500).send('Erro ao buscar livros e categorias!')
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

app.get(
    '/cadastrarVideo', 
    async (req, res) => {
        try {
            const criadores = await Criador.findAll({ raw: true })
            const hastags = await Hastag.findAll({ raw: true })
            res.render('cadastrarVideo', { criadores: criadores, hastags: hastags })
        } catch (erro) {
            console.error('Erro ao carregar cadastro de vídeo:', erro)
            res.status(500).send('Erro ao carregar cadastro!')
        }
    }
)

app.post(
    '/cadastrarVideo', 
    async (req, res) => {
        try {
            const { titulo, descricao, criadorId, hastagIds } = req.body
            const video = await Video.create({ titulo: titulo, descricao: descricao, criadorId: criadorId })
            await video.setHastags(hastagIds)
            console.log('Vídeo cadastrado com sucesso!')
            res.redirect('/video/' + video.id)
        } catch (erro) {
            console.error('Erro ao cadastrar vídeo:', erro)
            res.status(500).send('Erro ao cadastrar vídeo!')
        }
    }
)

app.get(
    '/video/:id', 
    async (req, res) => {
        try {
            const id = req.params.id
            const video = await Video.findByPk(id, {
                include: [
                    {
                        model: Criador,
                        as: 'criador'
                    },
                    {
                        model: Hastag,
                        as: 'hastags'
                    }
                ]
            })

            if (!video) {
                return res.status(404).send('Vídeo não encontrado!')
            }

            const videoJSON = video.toJSON()
            console.log('Vídeo encontrado:')
            console.log(videoJSON)
            res.render('detalharVideo', {
                video: videoJSON
            })

        } catch (erro) {
            console.error('Erro ao detalhar vídeo:', erro)
            res.status(500).send('Erro ao detalhar vídeo!')
        }
    }
)

app.get(
    '/criador/:id', 
    async (req, res) => {
        try {
            const id = req.params.id
            const criador = await Criador.findByPk(id, {
                include: [
                    {
                        model: PerfilCriador,
                        as: 'perfil'
                    },
                    {
                        model: Video,
                        as: 'videos'
                    }
                ]
            })

            if (!criador) {
                return res.status(404).send('Criador não encontrado!')
            }

            const criadorJSON = criador.toJSON()

            console.log('Criador encontrado:')
            console.log(criadorJSON)

            res.render('detalharCriador', {
                criador: criadorJSON
            })

        } catch (erro) {
            console.error('Erro ao detalhar criador:', erro)
            res.status(500).send('Erro ao detalhar criador!')
        }
    }
)

app.get(
    '/cadastrarCriador', 
    async (req, res) => {
        res.render('cadastrarCriador')
    }
)

app.post(
    '/cadastrarCriador', 
    async (req, res) => {
        try {
            const { nome, nomeUsuario, seguidores } = req.body
            await Criador.create({ nome, nomeUsuario, seguidores })

            console.log('Criador cadastrado com sucesso!')
            res.redirect('/criadores')

        } catch (erro) {
            console.error('Erro ao cadastrar criador:', erro)
            res.status(500).send('Erro ao cadastrar criador!')
        }
    }
)


app.get(
    '/criadores', 
    async (req, res) => {
        try {
            const criadores = await Criador.findAll({
                include: [
                    {
                        model: PerfilCriador,
                        as: 'perfil'
                    },
                    {
                        model: Video,
                        as: 'videos'
                    }   
                ]
            })

            const criadoresJSON = criadores.map(criador => criador.toJSON())
            res.render('criadores', {
                criadores: criadoresJSON
            })
        } catch (erro) {
            console.error('Erro ao buscar criadores:', erro)
            res.status(500).send('Erro ao buscar criadores!')
        }
    }
)

app.get(
    '/cadastrarPerfil', 
    async (req, res) => {
        try {
            const criadores = await Criador.findAll({ raw: true })
            res.render('cadastrarPerfil', { criadores })
        } catch (erro) {
            console.error('Erro ao carregar criadores:', erro)
            res.status(500).send('Erro ao carregar criadores!')
        }
    }
)


app.post(
    '/cadastrarPerfil', 
    async (req, res) => {
        try {
            const { criadorId, bio, fotoUrl, linkRedeSocial } = req.body
            await PerfilCriador.create({ criadorId, bio, fotoUrl,linkRedeSocial })

            console.log('Perfil cadastrado com sucesso!')
            res.redirect('/criador/' + criadorId)
        } catch (erro) {
            console.error('Erro ao cadastrar perfil:', erro)
            res.status(500).send('Erro ao cadastrar perfil!')
        }
    }
)

app.get(
    '/cadastrarHastag', 
    async (req, res) => {
        res.render('cadastrarHastag')
    }
)


app.post(
    '/cadastrarHastag',   
    async (req, res) => {
        try {
            const { nome } = req.body
            await Hastag.create({ nome })

            console.log('Hastag cadastrada com sucesso!')
            res.redirect('/cadastrarHastag')
        } catch (erro) {
            console.error('Erro ao cadastrar hastag:', erro)
            res.status(500).send('Erro ao cadastrar hastag!')
        }
    }
)

app.get(
    '/videos', 
    async (req, res) => {
        try {
            const videos = await Video.findAll({
                include: [
                    {
                        model: Criador,
                        as: 'criador'
                    },
                    {
                        model: Hastag,
                        as: 'hastags'
                    }
                ]
            })

            const videosJSON = videos.map(video => video.toJSON())
            res.render('videos', {
                videos: videosJSON
            })
        } catch (erro) {
            console.error('Erro ao buscar vídeos:', erro)
            res.status(500).send('Erro ao buscar vídeos!')
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