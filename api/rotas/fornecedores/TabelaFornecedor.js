const Modelo = require('./ModeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

module.exports = {
    listar() {
        //O objeto raw define que o método findAll retornará dados puros, sem o parâmetro, seria retornadas instâncias do Sequelize.
        return Modelo.findAll({raw: true})
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
            throw new NaoEncontrado('Fornecedor')
        }
        //Retorna o resultado da busca
        return encontrado
    },

    atualizar(id, dadosParaAtualizar) {
        return Modelo.update(dadosParaAtualizar, {
            where: {id: id},
        })
    },
    
    remover(id) {
        return Modelo.destroy({
            where: {id: id}
        })
    }
}