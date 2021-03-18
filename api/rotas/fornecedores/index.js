const roteador = require('express').Router()
const TabelaForecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

//Para identificação das rotas, utilizaremos os mesmos métodos http

//Retorna a lista de fornecedores cadastrados
roteador.get('/', async (req, res) => {
    const resultados = await TabelaForecedor.listar()
    res.send(JSON.stringify(resultados))
})

//Realiza o cadastro de Fornecedores
roteador.post('/', async (req, res) => {
    //Acessa os dados enviados pelo cliente
    const dadosRecebidos = req.body
    //Cria uma nova instância de Fornecedor com os dados recebidos na requisição
    const fornecedor = new Fornecedor(dadosRecebidos)
    //Encaminha as informações para persistência no Banco de dados
    await fornecedor.criar()
    //Após insert, encaminha o fornecedor cadastrado como resposta para o cliente
    res.send(JSON.stringify(fornecedor))
})

//Retorna um fornecedor cadastrado por id
roteador.get('/:idFornecedor', async (req, res) => {
    try {
        //Recebe o id passado como parâmetro na URL
        const id = req.params.idFornecedor
        //Cria uma instância de Fornecedor passando apenas o id
        const fornecedor = new Fornecedor({id: id})
        //Realiza a busca no banco de dados com base no id passado no construtor
        await fornecedor.carregar()
        //Envia o resultado para o cliente
        res.send(JSON.stringify(fornecedor))
    } catch (erro) {
        //Encaminha a mensagem de erro para o cliente
        res.send(JSON.stringify({
            mensagem: erro.message
        }))
    }
})

roteador.put("/:idFornecedor", async (req, res) => {
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
        res.end()
        } catch (erro) {
            res.send(JSON.stringify({
                mensagem: erro.message
            }))
        }
    }
)

module.exports = roteador