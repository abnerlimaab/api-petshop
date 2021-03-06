const express = require('express') //Importa o express
const app = express() //Instancia o express
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

//Nossa API utilizará o formato JSON
app.use(express.json())

app.use((req, res, proximo) => {
    //Através do método header extraímos o formato da requisição
    let formatoRequisitado = req.header('Accept')
    //Caso o cliente não especifique o formato na  requisição, responderemos em JSON
    if (formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json'
    }
    //Verifica o formato requisitado e caso não seja um formato aceito retorna o status 406 e encerra a conexão
    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406)
        res.end()
        return
    }
    //Caso o formato requisitado seja aceito, devolveremos a resposta com o mesmo formato. Para isso utilizamos o método setHeader que passa o formato requisitado no cabeçalho da resposta
    res.setHeader('Content-Type', formatoRequisitado)
    //Segue para o próximo middleware
    proximo()
})

//Middleware utilizado para ajuste do Headers para o navegador
app.use((req, res, proximo) => {
    //Permite o acesso a API pelo navegador a partir do site passado no segundo parâmetro
    res.set('Access-Control-Allow-Origin', '*')
    //Segue para o próximo middleware
    proximo()
})

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

//Acessa a versão 2.0.0 (SEMVER)
const roteadorV2 = require('./rotas/fornecedores/rotas.v2')
app.use('/api/v2/fornecedores', roteadorV2)

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
    const serializador = new SerializadorErro(
        res.getHeader('Content-Type')
    )
    res.status(status)
    res.send(serializador.serializar({
        mensagem: erro.message,
        id: erro.idErro
    }))
})

//O método listen recebe a porta que o servidor irá escutar e uma função de callback
app.listen(config.get('api.porta'), () => console.log('A API está funcionando'))