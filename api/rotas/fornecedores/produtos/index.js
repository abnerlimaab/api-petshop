//Carrega o roteador e trazendo os parâmetros da camada anterior
const roteador = require('express').Router({mergeParams: true})
//Importa as funções declaradas na Tabela de Produtos (DAO)
const Tabela = require('./TabelaProduto')
//Importa a classe Produto
const Produto = require('./Produto')

//Rota GET utilizada para listar todos os produtos de um determinado fornecedor
roteador.get('/', async (req, res) => {
    //Carrega a listagem de produtos cadastrados em um determinado fornecedor
    const produtos = await Tabela.listar(req.fornecedor.id)
    //Envia um Array vazio em resposta ao cliente no formato JSON
    res.send(
        JSON.stringify(produtos)
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
        //Encaminha o status de sucesso na resposta
        res.status(201)
        //Retorna o produto criado para o cliente
        res.send(produto)
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

//Exporta o roteador para uso na API
module.exports = roteador