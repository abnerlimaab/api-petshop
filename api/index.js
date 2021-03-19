const express = require('express') //Importa o express
const app = express() //Instancia o express
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

//Nossa API utilizará o formato JSON
app.use(express.json())

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

app.use((erro, req, res, proximo) => {
    let status = 500
    if (erro instanceof NaoEncontrado) {
        status = 404
    }
    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400
    }
    if (erro instanceof ValorNaoSuportado) {
        status = 406
    }
    res.status(status)
    res.send(JSON.stringify({
        mensagem: erro.message,
        id: erro.idErro
    }))
})

//O método listen recebe a porta que o servidor irá escutar e uma função de callback
app.listen(config.get('api.porta'), () => console.log('A API está funcionando'))