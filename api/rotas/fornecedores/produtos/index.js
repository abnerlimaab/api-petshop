//Carrega o roteador e trazendo os parâmetros da camada anterior
const roteador = require('express').Router({mergeParams: true})
//Importa as funções declaradas na Tabela de Produtos
const Tabela = require('./TabelaProduto')

//Rota GET
roteador.get('/', async (req, res) => {
    //Carrega a listagem de produtos cadastrados em um determinado fornecedor
    const produtos = await Tabela.listar(req.params.idFornecedor)
    //Envia um Array vazio em resposta ao cliente no formato JSON
    res.send(
        JSON.stringify(produtos)
    )
})

//Exporta o roteador para uso na API
module.exports = roteador