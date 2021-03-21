//DAO onde concentraremos as funcionalidades da tabela
//Importa o modelo de tbela utilizado
const Modelo = require('./ModeloTabelaProduto')
const instancia = require('../../../banco-de-dados')

//Importe de erros
const NaoEncontrado = require('../../../erros/NaoEncontrado')

module.exports = {
    listar(idFornecedor) {
        return Modelo.findAll({
            //Realiza o filtro por id do fornecedor
            where: {
                fornecedor: idFornecedor
            },
            //Retorna o objeto encontrado como objeto puro em JavaScript. Caso seja falso, será retornado uma instância do Sequelize
            raw: true
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
    },

    async buscarPorId(idProduto, idFornecedor) {
        //Verifica se o produto existe no banco
        const encontrado = await Modelo.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            },
            //Retorna o objeto encontrado como objeto puro em JavaScript. Caso seja falso, será retornado uma instância do Sequelize
            raw: true
        })
        //Se o produto não for encontrado, retornaremos um erro
        if (!encontrado) {
            throw new NaoEncontrado('Produto')
        }
        //Retornamos o produto encontrado
        return encontrado
    },

    atualizar(dadosDoProduto, dadosParaAtualizar) {
        //Método do Sequelize que atualiza o banco de dados
        return Modelo.update(
            //Objeto com os dados a serem atualizados
            dadosParaAtualizar,
            {
                //Identificação do produto a ser atualizado
                where: dadosDoProduto
            }
        )
    },

    subtrair(idProduto, idFornecedor, campo, quantidade) {
        //Cria uma transação no Sequelize para evitar problemas de concorrência
        return instancia.transaction(async transacao => {
            //Identifica o produto no banco de dados através do método findOne do Sequelize
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })
            //Passamos a nova quantidade em estoque
            produto[campo] = quantidade
            //Sequelize salva a alteração do produto no banco de dados
            await produto.save()
            //Retornamos o produto alterado
            return produto
        })
    }
}