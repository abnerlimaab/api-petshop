const express = require('express') //Importa o express
const app = express() //Instancia o express
const config = require('config')

//Nossa API utilizará o formato JSON
app.use(express.json())

const roteador = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

//O método listen recebe a porta que o servidor irá escutar e uma função de callback
app.listen(config.get('api.porta'), () => console.log('A API está funcionando'))