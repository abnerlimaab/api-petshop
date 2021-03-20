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
    }
}