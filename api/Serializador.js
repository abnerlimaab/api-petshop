const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

class Serializador {
    json(dados) {
        //Retorna os dados em json
        return JSON.stringify(dados)
    }

    serializar(dados) {
        //Se o conteúdo recebido for do tipo json
        if (this.contentType === 'application/json') {
            //Retornaremos a instância em jsonn
            return this.json(dados)
        }
        //Retorna erro caso o formato não seja suportado
        throw new ValorNaoSuportado(this.contentType)
    }
}