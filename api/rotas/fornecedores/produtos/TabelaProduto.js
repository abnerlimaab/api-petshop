//DAO onde concentraremos as funcionalidades da tabela
//Importa o modelo de tbela utilizado
const Modelo = require('./ModeloTabelaProduto')

module.exports = {
    listar(idFornecedor) {
        return Modelo.findAll({
            //Realiza o filtro por id do fornecedor
            where: {
                fornecedor: idFornecedor
            }
        })
    },

    inserir(dados) {
        //Recebemos um objeto com as propriedades [titulo, preco, estoque, fornecedor] e realizamos o insert em nosso banco de dados através do método create do Sequelize.
        return Modelo.create(dados)
    },

    remover(idProduto, idFornecedor) {
        //Recebemos o id do Produto e do Fornecedor e no método destroy do Sequelize passamos um WHERE com os parâmetros
        return Modelo.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
    }
}