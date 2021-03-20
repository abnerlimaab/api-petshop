const roteador = require('express').Router()
const TabelaForecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

//Para identificação das rotas, utilizaremos os mesmos métodos http

//Retorna a lista de fornecedores cadastrados
roteador.get('/', async (req, res) => {
    const resultados = await TabelaForecedor.listar()
    res.status(200)
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
    res.send(serializador.serializar(resultados))
})

//Realiza o cadastro de Fornecedores
roteador.post('/', async (req, res, proximo) => {
    try {
        //Acessa os dados enviados pelo cliente
        const dadosRecebidos = req.body
        //Cria uma nova instância de Fornecedor com os dados recebidos na requisição
        const fornecedor = new Fornecedor(dadosRecebidos)
        //Encaminha as informações para persistência no Banco de dados
        await fornecedor.criar()
        //Após insert, encaminha o fornecedor cadastrado como resposta para o cliente
        res.status(201)
        const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
        res.send(serializador.serializar(fornecedor))
    } catch (erro) {
        proximo(erro)
    }
})

//Retorna um fornecedor cadastrado por id
roteador.get('/:idFornecedor', async (req, res, proximo) => {
    try {
        //Recebe o id passado como parâmetro na URL
        const id = req.params.idFornecedor
        //Cria uma instância de Fornecedor passando apenas o id
        const fornecedor = new Fornecedor({id: id})
        //Realiza a busca no banco de dados com base no id passado no construtor
        await fornecedor.carregar()
        //Envia o resultado para o cliente
        res.status(200)
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
            )
        res.send(serializador.serializar(fornecedor))
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put("/:idFornecedor", async (req, res, proximo) => {
    try {
        //Recebe o id passado como parâmetro pela URL
        const id = req.params.idFornecedor
        //Recebe o corpo da requisição
        const dadosRecebidos = req.body
        //Unifica o id aos dadosReccebidos
        const dados = Object.assign({}, dadosRecebidos, {id: id})
        //Instancia um Fornecedor
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.status(204)
        res.end()
        } catch (erro) {
            proximo(erro)
        }   
    }
)

roteador.delete('/:idFornecedor', async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({id: id})
        await fornecedor.carregar()
        await fornecedor.remover()
        res.status(204)
        res.end()
    } catch (erro) {
        proximo(erro)
    }
})

//Importa o index de produtos
const roteadorProdutos = require('./produtos')
//Cria a rota de produtos informando a URL e o roteadorr do produtos
roteador.use('/:idFornecedor/produtos', roteadorProdutos)

module.exports = roteador