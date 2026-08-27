const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

const sequelize = require('./config/bd')
const methodOverride = require('method-override');

const Filme = require('./models/filme.model')
const Artista = require('./models/artista.model')
const Diretor = require('./models/diretor.model')
const Ficha = require('./models/fichaTecnica.model')

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
        const filmes = await Filme.findAll({ raw: true });
        res.render('home', { filmes })
    }
)

//filmes
app.get(
    '/cadastrar/filmes',
    async(req,res) => {
        res.render('cadastrarFilmes')
    }
)

app.post(
    '/cadastrar/filmes',
    async(req,res) => {
        const { nome, anoLancamento } = req.body
        try { 
            console.log('Dados Recebidos', req.body)

            await Filme.create({ nome, anoLancamento })
            res.redirect('/filmes')
        }catch (erro) {
            console.error('Falha no Cadastro!', erro)
            res.status(500).send('Erro ao Inserir Filme!')
        }
    }
)

app.get(
    '/filmes',
    async(req,res) => {
        try{
        const filmes = await Filme.findAll()
        const filmesJSON = filmes.map(filme => filme.toJSON())
        console.log('Dados Encontrados', filmesJSON)
        res.render('filmes', {
            filmes: filmesJSON
        })
        }catch (erro){
            console.error('Falha na Busca dos Filmes!', erro)
            res.status(500).send('Erro ao Buscar Filmes!')
        }
    } 
)

app.get(
    '/editar/filmes/:id',
    async(req,res) => {
        const id = req.params.id
        const filme = await Filme.findByPk(id)
        res.render('editarFilmes', {
            filme: filme.toJSON()
        })
    }
)

app.put(
    '/editar/filmes/:id',
    async(req,res) => {
        const { nome, anoLancamento } = req.body
        await Filme.update(
        {
            nome, anoLancamento
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    res.redirect('/filmes')
    }
)

app.delete(
    '/deletar/filmes/:id',
    async(req,res) => {
        await Filme.destroy(
            {
                where: {
                    id: req.params.id
                }
            }
        )
        res.redirect('/filmes')
    }
)

//artistas
app.get(
    '/cadastrar/artistas',
    async(req,res) => {
        res.render('cadastrarArtistas')
    }
)

app.post(
    '/cadastrar/artistas',
    async(req,res) => {
        const { nome, anoNascimento, foto, nomeArtistico, tecAtuacao, atv  } = req.body
        try { 
            console.log('Dados Recebidos', req.body)

            await Artista.create({ nome, anoNascimento, foto, nomeArtistico, tecAtuacao, atv })
            res.redirect('/artistas')
        }catch (erro) {
            console.error('Falha no Cadastro!', erro)
            res.status(500).send('Erro ao Inserir Artista!')
        }
    }
)

app.get(
    '/artistas',
    async(req,res) => {
        try{
        const artistas = await Artista.findAll()
        const artistasJSON = artistas.map(artista => artista.toJSON())
        console.log('Dados Encontrados', artistasJSON)
        res.render('artistas', {
            artistas: artistasJSON
        })
        }catch (erro){
            console.error('Falha na Busca dos Artistas!', erro)
            res.status(500).send('Erro ao Buscar Artistas!')
        }
    } 
)

app.get(
    '/editar/artistas/:id',
    async(req,res) => {
        const id = req.params.id
        const artista = await Artista.findByPk(id)
        res.render('editarArtistas', {
            artista: artista.toJSON()
        })
    }
)

app.put(
    '/editar/artistas/:id',
    async(req,res) => {
        const { nome, anoNascimento, foto, nomeArtistico, tecAtuacao, atv } = req.body
        await Artista.update(
        {
             nome, anoNascimento, foto, nomeArtistico, tecAtuacao, atv
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    res.redirect('/artistas')
    }
)

app.delete(
    '/deletar/artistas/:id',
    async(req,res) => {
        await Artista.destroy(
            {
                where: {
                    id: req.params.id
                }
            }
        )
        res.redirect('/artistas')
    }
)

// diretores
app.get(
    '/cadastrar/diretores',
    async(req,res) => {
        res.render('cadastrarDiretores')
    }
)

app.post(
    '/cadastrar/diretores',
    async(req,res) => {
        const { nome, anoNascimento, atv } = req.body
        try { 
            console.log('Dados Recebidos', req.body)

            await Diretor.create({ nome, anoNascimento, atv })
            res.redirect('/diretores')
        }catch (erro) {
            console.error('Falha no Cadastro!', erro)
            res.status(500).send('Erro ao Inserir Diretor!')
        }
    }
)

app.get(
    '/diretores',
    async(req,res) => {
        try{
        const diretores = await Diretor.findAll()
        const diretoresJSON = diretores.map(diretor => diretor.toJSON())
        console.log('Dados Encontrados', diretoresJSON)
        res.render('diretores', {
            diretores: diretoresJSON
        })
        }catch (erro){
            console.error('Falha na Busca dos Diretores!', erro)
            res.status(500).send('Erro ao Buscar Diretores!')
        }
    } 
)

app.get(
    '/editar/diretores/:id',
    async(req,res) => {
        const id = req.params.id
        const diretor = await Diretor.findByPk(id)
        res.render('editarDiretores', {
            diretor: diretor.toJSON()
        })
    }
)

app.put(
    '/editar/diretores/:id',
    async(req,res) => {
        const { nome, anoNascimento, atv } = req.body
        await Diretor.update(
        {
            nome, anoNascimento, atv
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    res.redirect('/diretores')
    }
)

app.delete(
    '/deletar/diretores/:id',
    async(req,res) => {
        await Diretor.destroy(
            {
                where: {
                    id: req.params.id
                }
            }
        )
        res.redirect('/diretores')
    }
)

// ficha tecnica
/*app.get(
    '/cadastrar/fichas',
    async(req,res) => {
        res.render('cadastrarFichas')
    }
)*/

app.get('/filmes/:id/cadastrar/fichas', async (req, res) => {
  const id = req.params.id;
  const filme = await Filme.findByPk(id, { raw: true });
  res.render('cadastrarFichaTecnica', { filme });
});

/* app.post(
    '/cadastrar/fichas',
    async(req,res) => {
        const { nome, genero } = req.body
        try { 
            console.log('Dados Recebidos', req.body)

            await Filme.create({ nome, genero })
            res.redirect('/fichas')
        }catch (erro) {
            console.error('Falha no Cadastro!', erro)
            res.status(500).send('Erro ao Inserir Ficha!')
        }
    }
)*/

app.post('/filmes/:id/fichas', async (req, res) => {
  const id = req.params.id;
  const duracao = req.body.duracao;
  const orcamento = req.body.orcamento;
  const bilheteria = req.body.bilheteria;

  const filme = await Filme.findByPk(id);

  await filme.createFicha({
    duracao: duracao,
    orcamento: orcamento,
    bilheteria: bilheteria
  });

  res.redirect(`/filmes/${id}`);
});

app.get(
    '/fichas',
    async(req,res) => {
        try{
        const fichas = await Ficha.findAll()
        const fichasJSON = fichas.map(ficha => ficha.toJSON())
        console.log('Dados Encontrados', fichasJSON)
        res.render('fichaTecnica', {
            fichas: fichasJSON
        })
        }catch (erro){
            console.error('Falha na Busca das Fichas!', erro)
            res.status(500).send('Erro ao Buscar Fichas!')
        }
    } 
)

app.get(
    '/editar/fichas/:id',
    async(req,res) => {
        const id = req.params.id
        const ficha = await Ficha.findByPk(id)
        res.render('editarFichaTecnica', {
            ficha: ficha.toJSON()
        })
    }
)

app.put(
    '/editar/fichas/:id',
    async(req,res) => {
        const { nome, genero } = req.body
        await Ficha.update(
        {
            nome, genero
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    res.redirect('/fichas')
    }
)

app.delete(
    '/deletar/fichas/:id',
    async(req,res) => {
        await Ficha.destroy(
            {
                where: {
                    id: req.params.id
                }
            }
        )
        res.redirect('/fichas')
    }
)

app.get('/filmes/:id', async (req, res) => {
  const id = req.params.id;
  const filme = await Filme.findByPk(id, {
    include: [
      { model: Diretor, as: 'diretor' },
      { model: Artista, as: 'artistas' },
      { model: Ficha, as: 'fichaTecnica' }
    ]
  });
  res.render('detalharFilme', { filme: filme.toJSON() });
});

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