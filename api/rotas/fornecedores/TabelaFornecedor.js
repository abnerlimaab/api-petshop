const Modelo = require('./ModeloTabelaFornecedor')

module.exports = {
    listar() {
        return Modelo.findAll()
    },

    inserir(fornecedor) {
        return Modelo.create(fornecedor)
    },

    async buscarPorId(id) {
        //Método utilizado pelo Sequelize para busca na tabela
        const encontrado = await Modelo.findOne({
            where: {
                id: id
            }
        })
        //Se o fornecedor não for encontrado retorna erro
        if(!encontrado) {
            throw new Error('Fornecedor não encontrado')
        }
        //Retorna o resultado da busca
        return encontrado
    },

    atualizar(id, dadosParaAtualizar) {
        return Modelo.update(dadosParaAtualizar, {
            where: {id: id},
        })
    }
}