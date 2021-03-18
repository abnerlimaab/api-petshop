const roteador = require('express').Router()
const TabelaForecedor = require('./TabelaFornecedor')

roteador.use('/', async (req, res) => {
    const resultados = await TabelaForecedor.listar()
    res.send(JSON.stringify(resultados))
})

module.exports = roteador