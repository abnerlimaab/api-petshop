const modeloTabela = require('../rotas/fornecedores/ModeloTabelaFornecedor')
modeloTabela.sync()
    .then(() => console.log('Tabela criada com sucesso'))
    .catch(console.log)