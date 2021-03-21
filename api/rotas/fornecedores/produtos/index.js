//Carrega o roteador e trazendo os parâmetros da camada anterior
const roteador = require('express').Router({mergeParams: true})
//Importa as funções declaradas na Tabela de Produtos (DAO)
const Tabela = require('./TabelaProduto')
//Importa a classe Produto
const Produto = require('./Produto')
//Importa o Serializador de produtos
const Serializador = require('../../../Serializador').SerializadorProduto

roteador.get('/', async (req, res) => {
    //Carrega a listagem de produtos cadastrados em um determinado fornecedor
    const produtos = await Tabela.listar(req.fornecedor.id)
    const serializador = new Serializador(
        //Encaminha o Content-Type da resposta para o Serializador
        res.getHeader('Content-Type'),
    )
    //Envia a resposta no formato solicitado através do método serializar
    res.send(
        serializador.serializar(produtos)
    )
})

roteador.post('/', async (req, res, proximo) => {
    try {
        //Retira o id do Fornecedor da requisição
        const idFornecedor = req.fornecedor.id
        //Carrega o corpo da requisição na variável corpo
        const corpo = req.body
        //Na variável dados, unificamos o corpo da requisição com o id do Fornecedor
        const dados = Object.assign({}, corpo, {fornecedor: idFornecedor})
        //Criamos umma instância de produto com os dados obtidos
        const produto = new Produto(dados)
        //Insere o produto no banco de dados
        await produto.criar()
        const serializador = new Serializador(
            //Encaminha o Content-Type da resposta para o Serializador
            res.getHeader('Content-Type'),
        )
        //Encaminha o status de sucesso na resposta
        res.status(201)
        //Envia a resposta no formato solicitado através do método serializar
        res.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        //Em caso de erro, passa para o próximo middleware com o erro como argumento
        proximo(erro)
    }
})

roteador.delete('/:id', async (req, res) => {
    //Cria um objeto com os dados da requisição
    const dados = {
        id: req.params.id,
        fornecedor: req.fornecedor.id
    }
    //Cria uma instância de produto com os dados obtidos da requisição
    const produto = new Produto(dados)
    //Apaga o produto instanciado
    await produto.apagar()
    //Passa o status 204 - Sucesso, Sem conteúdo
    res.status(204)
    //Encerra a requisição
    res.end()
})

roteador.get('/:id', async (req, res, proximo) => {
    try {
        //Declaração de variáveis da requisição
        const dados = {
            //O id do produto será retirado do parâmetro da url da requisição
            id: req.params.id,
            //O fornecedor será retirado da instância de Fornecedor inclusa na requisição anteriormente
            fornecedor: req.fornecedor.id
        }
        //Cria uma instância de produto com os dados retirados da requisição
        const produto = new Produto(dados)
        //Inclui na instância de produto os valores obtidos do banco de dados
        await produto.carregar()
        const serializador = new Serializador(
            //Encaminha o Content-Type da resposta para o Serializador
            res.getHeader('Content-Type'),
            //Campos Extras solicitados
            ['preco', 'estoque', 'fornecedor', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        //Envia a resposta no formato solicitado através do método serializar
        res.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        //Encaminha o erro para tratamento em nosso middleware da raiz da API
        proximo(erro)
    }
})

roteador.put('/:id', async (req, res, proximo) => {
    try {
        const dados = Object.assign(
            //Objeto inicial
            {},
            //Corpo da requisição
            req.body,
            //identificadores do produto
            {
                id: req.params.id,
                fornecedor: req.fornecedor.id
            }
        )
        //Cria uma nova instância de produto com os dados colhidos da requisição
        const produto = new Produto(dados)
        //Atualiza o produto no banco de dados
        await produto.atualizar()
        //Define o status da resposta - No content
        res.status(204)
        //Encerra a requisição
        res.end()
    } catch (erro) {
        //Encaminha o erro para tratamento em nosso middleware da raiz da API
        proximo(erro)
    }
})

roteador.post('/:id/diminuir-estoque', async (req, res, proximo) => {
    try {
        //Cria a instância de produto com os identificadores recebidos na requisição
        const produto = new Produto({
            id: req.params.id,
            fornecedor: req.fornecedor.id
        })
        //Carrega o produto no banco de dados
        await produto.carregar()
        //Diminui o estoque conforme solicitado na requisição
        produto.estoque = produto.estoque - req.body.quantidade
        await produto,diminuirEstoque()
        //Resposta No-Content
        res.status(204)
        res.end()
    } catch (erro) {
        //Encaminha o erro para tratamento em nosso middleware da raiz da API
        proximo(erro)
    }
})

//Exporta o roteador para uso na API
module.exports = roteador