const Sequelize = require('sequelize')
const Instancia = require('../../banco-de-dados')

const colunas = {
    empresa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.ENUM('ração', 'brinquedos'),
        allowNull: false
    }
}

const opcoes = {
    FreezeTableName: true,
    TableName: 'fornecedores',
    timestamps: true,
    createdAt: 'dataCriacao',
    updateAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = Instancia.define('fornecedor', colunas, opcoes)