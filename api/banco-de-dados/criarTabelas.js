//Define os modelos de tabela a serem criadas
const modelos = [
    require('../rotas/fornecedores/ModeloTabelaFornecedor'),
    require('../rotas/fornecedores/produtos/ModeloTabelaProduto')
]

async function criarTabelas() {
    for(let contador = 0; contador < modelos.length; contador++) {
        const modelo = modelos[contador]
        //Sincroniza o modelo atual com o banco de dados
        await modelo.sync()
    }
}

criarTabelas()