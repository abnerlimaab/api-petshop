const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

class Serializador {
    json(dados) {
        //Retorna os dados em json
        return JSON.stringify(dados)
    }

    serializar(dados) {
        //Se o conteúdo recebido for do tipo json
        if (this.contentType === 'application/json') {
            //Retornaremos os campos publicos da instância em jsonn
            return this.json(this.filtrar(dados))
        }
        //Retorna erro caso o formato não seja suportado
        throw new ValorNaoSuportado(this.contentType)
    }

    filtrarObjeto(dados) {
        //instancia o novo objeto
        const novoObjeto = {}
        this.camposPublicos.forEach((campo) => {
            //se os dados tiverem as propriedades públicas, eles serão armazenados no novo objeto
            if (dados.hasOwnProperty(campo))
            novoObjeto[campo] = dados[campo]
        })
        return novoObjeto
    }

    filtrar(dados) {
        //Se dados for uma lista, será criada uma nova lista apenas com os campos públicos
        if (Array.isArray(dados)) {
            dados = dados.map(item => {return this.filtrarObjeto(item)})
        } 
        //Caso seja apenas um objeto, retornaremos os dados filtrados
        else {
            dados = this.filtrarObjeto(dados)
        }
        return dados
    }
}

class SerializadorFornecedor extends Serializador {
    constructor(contentType) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'empresa', 'categoria']
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    formatosAceitos: ['application/json']
}