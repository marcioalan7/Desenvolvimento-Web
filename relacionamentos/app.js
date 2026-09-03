const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

const sequelize = require('./config/bd')
const methodOverride = require('method-override');

const Filme = require('./models/filme.model')
const Artista = require('./models/artista.model')
const Diretor = require('./models/diretor.model')
const FichaTecnica = require('./models/fichaTecnica.model')

require('./models/relacionamentoModels');

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

//filmes
app.get(
    '/cadastrar/filmes',
    async(req,res) => {
        const diretores = await Diretor.findAll({ raw: true }) 
        const artistas = await Artista.findAll({ raw: true })
        res.render('cadastrarFilmes', { diretores: diretores, artistas: artistas })
    }
)

app.post(
    '/cadastrar/filmes',
    async(req,res) => {
        const { nome, anoLancamento, diretorId, artistas } = req.body
        try { 
            console.log('Dados Recebidos', req.body)

            const filme = await Filme.create({ nome, anoLancamento, diretorId })
            
            await filme.setArtistas(artistas)

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
    '/artistas/:id', 
    async (req, res) => {
    const id = req.params.id;
    const artista = await Artista.findByPk(id, {
    include: [{ model: Filme, as: 'filmes' }]
  }
);

    res.render('detalharArtista', { artista: artista.toJSON() });
});

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
    '/diretores/:id', 
    async (req, res) => {
    const id = req.params.id;
    const diretor = await Diretor.findByPk(id, {
    include: [{ model: Filme, as: 'filmes' }]
  }
);

    res.render('detalharDiretor', { diretor: diretor.toJSON() });
});

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

// relacionamentos

app.get(
    '/filmes/:id/ficha-tecnica/cadastrar', 
    async (req, res) => {
    const id = req.params.id;
    const filme = await Filme.findByPk(id, { raw: true });
    res.render('cadastrarFichaTecnica', { filme });
}
);

app.post(
    '/filmes/:id/ficha-tecnica', 
    async (req, res) => {
    const id = req.params.id;
    const duracaoMinutos = req.body.duracaoMinutos;
    const orcamento = req.body.orcamento;
    const bilheteria = req.body.bilheteria;
    const filme = await Filme.findByPk(id);

await filme.createFichaTecnica({
    duracaoMinutos: duracaoMinutos,
    orcamento: orcamento,
    bilheteria: bilheteria
}
);

    res.redirect(`/filmes/${id}`);
});

app.get(
    '/filmes/:id', 
    async (req, res) => {
    const id = req.params.id;
    const filme = await Filme.findByPk(id, {
    include: [{model: Artista, as:'artistas'},
        { model: Diretor, as: 'diretor' },
        { model: FichaTecnica, as: 'fichaTecnica' }]
}
);

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