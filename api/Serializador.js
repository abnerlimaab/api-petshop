const { application } = require('express')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const jsontoxml = require('jsontoxml')

class Serializador {
    json(dados) {
        //Retorna os dados em json
        return JSON.stringify(dados)
    }

    xml(dados) {
        let tag = this.tagSingular
        //Se for um Array, passaremos primeiramente a tag no plural
        if (Array.isArray(dados)) {
            tag = this.tagPlural
            //Através do método map, conseguimos executar a função para cada item da lista e então criar uma nova lista com os resultados obtidos
            dados = dados.map(item => {
                return {
                    [this.tagSingular]: item
                }
            })
        }
        //Converte os dados em xml. Toda classe que tiver a variável tag será lançada como argumento da função
        return jsontoxml({[tag]: dados})
    }

    serializar(dados) {
        //Realiza o filtro de dados mantendo apenas os campos públicos
        dados = this.filtrar(dados)
        //Se o conteúdo recebido for do tipo json
        if (this.contentType === 'application/json') {
            //Retornaremos os campos publicos da instância em jsonn
            return this.json(dados)
        }
        //Se o conteúdo recebido for do tipo xml
        if (this.contentType === 'application/xml') {
            //Retornaremos os campos públicos em xml
            return this.xml(dados)
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
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'empresa', 'categoria'].concat(camposExtras || [])
        //Atributo utilizado na conversão para XML
        this.tagSingular = 'fornecedor'
        this.tagPlural = 'fornecedores'
    }
}

class SerializadorErro extends Serializador {
    constructor(contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['id', 'mensagem'].concat(camposExtras || [])
        //Atributo utilizado na conversão para XML
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

class SerializadorProduto extends Serializador {
    constructor(contentType, camposExtras) {
        super()
        //Determina o contentType da instância
        this.contentType = contentType
        //Inclui o id e titulo do produto nos campos públicos da instância e concatena com possíveis campos extras solicitados na requisição
        this.camposPublicos = ['id', 'titulo'].concat(camposExtras || [])
        //Tags que serão utilizadas na conversão para XML
        this.tagSingular = 'produto'
        this.tagPlural = 'produtos'
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorErro: SerializadorErro,
    SerializadorProduto: SerializadorProduto,
    //Define os formatos que serão aceitos
    formatosAceitos: ['application/json', 'application/xml']
}