class selecionaPacientes {

    constructor() {
        this.idPaciente = id; 
        this.nomePaciente = nome;
    }

    get Id() { return this.id; }
    set Id(value) { this.id = value; }

    get NomePaciente() { return this.nomePaciente; }
    set NomePaciente(value) { this.nomePaciente = value; }
}

module.exports = selecionaPacientes;
