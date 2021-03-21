//Importa as funções declaradas na Tabela de Produtos (DAO)
const Tabela = require('./TabelaProduto')

class Produto {
    //Separamos o objeto da requisição em variáveis na instância
    constructor({id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao}) {
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.fornecedor = fornecedor
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    validar() {
        //O campo titulo deve ser do tipo string e não pode estar vazio
        if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
            throw new Error(`O campo titulo está inválido`)
        }
        //O campo preco deve ser do tipo number e maior que zero
        if (typeof this.preco !== 'number' || this.preco === 0) {
            throw new Error(`O campo preco está inválido`)
        }
    }

    async criar() {
        //Verifica se os campos da requisição são válidos e emite erros caso não sejam
        this.validar()
        //Encaminhamos as propriedades que não são criadas automaticamente pelo nosso banco como um novo objeto através do método inserir do DAO e receberemos como retorno o objeto criado em nosso banco de dados
        const resultado = await Tabela.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        })
        //Após o retorno da função inserir, assimilaremos as propriedades geradas no banco de dados em atributos da instância
        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.fornecedor = resultado.fornecedor
    }

    apagar() {
        //Encaminhamos as propriedades id e fornecedor recebidas na instância de Produto e retornamos o resultado
        return Tabela.remover(this.id, this.fornecedor)
    }

    async carregar() {
        //Recebe o produto do banco de dados com o id e fornecedor indicado
        const produto = await Tabela.buscarPorId(this.id, this.fornecedor)
        //Assimilação de valores obtidos do banco de dados na instância de produto
        this.titulo = produto.titulo
        this.preco = produto.preco
        this.estoque = produto.estoque
        this.dataCriacao = produto.dataCriacao
        this.dataAtualizacao = produto.dataAtualizacao
        this.versao = produto.versao
    }

    atualizar() {
        //Valida os dados que podem serão atualizados
        const dadosParaAtualizar = {}
        if (typeof this.titulo === 'string' && this.titulo.length > 0) {
            dadosParaAtualizar.titulo = this.titulo
        }
        if (typeof this.preco === 'number' && this.titulo.length > 0) {
            dadosParaAtualizar.preco = this.preco
        }
        if (typeof this.estoque === 'number') {
            dadosParaAtualizar.estoque = this.estoque
        }
        //Caso dadosParaAtualizar esteja vazio, retornaremos um erro
        if (Object.keys(dadosParaAtualizar).length === 0) {
            throw new Error('Não foram fornecidos dados para atualizar')
        }

        return Tabela.atualizar(
            //Objeto identificador do produto
            {
                id: this.id,
                fornecedor: this.fornecedor
            },
            //Objeto de dados para atualizar
            dadosParaAtualizar
        )
    }

    diminuirEstoque() {
        return Tabela.subtrair(
            this.id,
            this.fornecedor,
            'estoque',
            this.estoque
        )
    }
}

module.exports = Produto