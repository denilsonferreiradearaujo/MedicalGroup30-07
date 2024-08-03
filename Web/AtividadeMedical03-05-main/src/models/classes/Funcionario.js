class Funcionario {
    constructor(pFun) {
        this.id = (pFun.id !== null || pFun.id > 0) ? pFun.id : null;
        if (pFun.data_admissao === null || pFun.data_admissao == "") {
            this.data_admissao = pFun.data_admissao;
        } else {
            this.data_admissao = this.DataConvert(pFun.data_admissao);
        }
        this.crm = pFun.crm;
        this.pessoa_id = pFun.pessoa_id;
        this.pessoa_endereco_id = pFun.pessoa_endereco_id;
    }

    get Id() { return this.id; }

    get Data_admissao() { return this.data_admissao; }
    set Data_admissao(value) { this.data_admissao = value; }

    get Crm() { return this.crm; }
    set Crm(value) { this.crm = value }

    get Pessoa_id() { return this.pessoa_id; }

    get Pessoa_endereco_id() { return this.pessoa_endereco_id; }

    DataConvert(value) {
        // if (value === null || typeof value !== 'string') {
        //     return null; // ou lançar um erro, dependendo do comportamento desejado
        // }
        let [dia, mes, ano] = value.split('/');
        let dataFormatada = `${ano}-${mes}-${dia}`;
        this.data_admissao = new Date(dataFormatada);
        return this.Data_admissao;
    }

}

module.exports = Funcionario;