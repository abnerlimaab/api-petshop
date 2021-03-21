class NaoEncontrado extends Error {
    constructor(nome) {
        super(`${nome} não foi encontrado!`)
        this.name = 'NaoEncontrado'
        this.idError = 0
    }
}

module.exports = NaoEncontrado