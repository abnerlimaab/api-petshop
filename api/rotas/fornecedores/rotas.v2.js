const roteador = require('express').Router()
const TabelaForecedor = require('./TabelaFornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (req, res) => {
    res.set('Acces-Control-Allow-Methods', 'GET')
    res.set('Acces-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

roteador.get('/', async (req, res) => {
    const resultados = await TabelaForecedor.listar()
    res.status(200)
    const serializador = new SerializadorFornecedor(res.getHeader('Content-Type'))
    res.send(serializador.serializar(resultados))
})

module.exports = roteador