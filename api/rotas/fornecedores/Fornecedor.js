const TabelaFornecedor = require('./TabelaFornecedor')

class Fornecedor {
    //Recebe os dados enviados pelo cliente e os coloca na instância. As propriedades do objeto são isoladas em váriáveis dentro dos parâmetros do construtor
    constructor({id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao}) {
        //Criação de váriáveis com base nas propriedades do objeto
        this.id = id
        this.empresa = empresa
        this.email = email
        this.categoria = categoria
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    //Encaminha as informações para persistência no Banco de dados
    async criar() {
        //Aguarda e retorna o insert no banco de dados com base nas informações já conhecidas que foram extraidas da requisição do cliente pelo construtor
        const resultado = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria
        })

        //São inclusos na instância as informações que foram geradas automaticamente pelo Banco de dados obtidas em resultado
        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao
    }

    async carregar() {
        //Procura o Fornecedor no banco de dados passando como parâmetro apenas o id recebido na requisição
        const encontrado = await TabelaFornecedor.buscarPorId(this.id)
        //Inclui as informações encontradas na instância
        this.empresa = encontrado.empresa
        this.email = encontrado.email
        this.categoria = encontrado.categoria
        this.dataCriacao = encontrado.dataCriacao
        this.dataAtualizacao = encontrado.dataAtualizacao
        this.versao = encontrado.versao
    }

    async atualizar() {
        //Pesquisa o id no bancco de dados e retorna o objeto com susas propriedades
        await TabelaFornecedor.buscarPorId(this.id)
        //Verifica os campos válidos para alteração
        const campos = ['empresa', 'email', 'categoria']
        const dadosParaAtualizar = {}
        campos.forEach((campo) => {
            const valor = this[campo]
            if (typeof valor === 'string' && valor.length > 0) {
                dadosParaAtualizar[campo] = valor
            }
        })
        //Retorna erro caso não haja parâmetros para atualização
        if(Object.keys(dadosParaAtualizar).length === 0) {
            throw new Error('Não foram fornecidos dados para atualizar')
        }

        await TabelaFornecedor.atualizar(this.id, dadosParaAtualizar)        
    }
}

module.exports = Fornecedor