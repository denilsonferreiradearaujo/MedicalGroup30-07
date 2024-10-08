
// Imports da classes
const Consulta = require('../models/classes/Consulta');
const Endereco = require('../models/classes/Endereco');
const Especialidade = require('../models/classes/Especialidade');
const Funcionario = require('../models/classes/Funcionario');
const Login = require('../models/classes/Login');
const Paciente = require('../models/classes/Paciente');
const Perfil = require('../models/classes/Perfil');
const Pessoa = require('../models/classes/Pessoa');
const Prontuario = require('../models/classes/Prontuario');
const Telefone = require('../models/classes/Telefone');
const Validacoes = require('../models/classes/Validacoes');
const selecionaPacientes = require('../models/classes/selecionaPacientes')



// Import das funções das ClienteModel
const { deletarUsuario, buscarTodasPessoas ,buscarTodasAgendas,insert, remove, agendarConsulta, buscarPerfilPorLogin, selecionaPacientesBd, selecionaMedicosBd} = require('../models/query/ClienteModel');

function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const clienteController = {

    index: async (req, res) => {
        return res.render('pages/index', { usuarioLogado: false });
    },


    cadastro: async (req, res) => {
        return res.render('pages/cadastro', { usuarioLogado: true });
    },

    agendar: async (req, res) => {

        const pacientes = await selecionaPacientesBd();
        const medicos = await selecionaMedicosBd();

        // console.log(pacientes)
        console.log(medicos)
       
        return res.render('pages/agendarConsulta', { pacientes, medicos, usuarioLogado: true });
    },

    adm: async (req, res) => {
        return res.render('pages/adm', { usuarioLogado: true });
    },

    listar: async (req, res) => {
        return res.render('pages/listar', { usuarioLogado: true });
    },

    todosOsResultados: async (req, res) => {
        return res.render('pages/todosOsResultados', { usuarioLogado: true });
    },

    todosOsResultadosMobile: async (req, res) => {
        const medicoId = req.params.medicoId;
    
        if (!medicoId) {
            return res.status(400).json({ error: 'ID do médico não fornecido.' });
        }
    
        try {
            const medicoData = await buscarMedicoPorId(medicoId); // Função fictícia, substitua pelo método correto
            if (!medicoData) {
                return res.status(404).json({ error: 'Médico não encontrado.' });
            }
    
            return res.json(medicoData);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar dados do médico.' });
        }
    },
    

    detalhesPaciente: async (req, res) => {
        return res.render('pages/detalhesPaciente', { usuarioLogado: true });
    },



    // Função para remover acentos de caracteres

    login: async (req, res) => {
        try {
            const { login, senha } = req.body;

            // Verifica o tipo de perfil com base no login e senha
            const tipoPerfil = await buscarPerfilPorLogin(login, senha);

            if (!tipoPerfil) {
                return res.render('pages/index', { usuarioLogado: false, error: 'Login ou senha inválidos!' });
            }

            // Normaliza o tipo de perfil para lowercase e remove acentos para evitar problemas de comparação
            const tipoPerfilNormalizado = removerAcentos(tipoPerfil.toLowerCase());

            // Redirecionar com base no tipo de perfil
            switch (tipoPerfilNormalizado) {
                case 'paciente':
                    return res.render('pages/listar', { usuarioLogado: true }); // Exemplo de passagem de usuarioLogado
                case 'medico':
                    return res.render('pages/todosOsResultados', { usuarioLogado: true }); // Exemplo de passagem de usuarioLogado
                case 'funcionario':
                    return res.render('pages/adm', { usuarioLogado: true }); // Exemplo de passagem de usuarioLogado
                default:
                    throw new Error('Tipo de perfil desconhecido!');
            }
        } catch (error) {
            console.log(error);
            return res.render('pages/index', { usuarioLogado: false, error: 'Erro ao fazer login. Tente novamente.' });
        }
    },

    loginMobile : async (req, res) => {
        try {
            const { login, senha } = req.body;
    
            // Verifica o tipo de perfil com base no login e senha
            const tipoPerfil = await buscarPerfilPorLogin(login, senha);
    
            if (!tipoPerfil) {
                return res.json({ usuarioLogado: false, error: 'Login ou senha inválidos!' });
            }
    
            // Normaliza o tipo de perfil para lowercase e remove acentos para evitar problemas de comparação
            const tipoPerfilNormalizado = removerAcentos(tipoPerfil.toLowerCase());
            return res.json({ tipoPerfilNormalizado: tipoPerfilNormalizado, usuarioLogado: true });
        } catch (error) {
            console.log('Erro no loginMobile:', error);
            return res.json({ usuarioLogado: false, error: 'Erro ao fazer login. Tente novamente.' });
        }
    },
    
    adicionarCliente: async (req, res) => {
        try {
            const { cpf, nome, data_nasc, genero, email, logradouro, bairro, estado, numero, complemento, cep, tel1, tel2, data_admissao, crm, login, senha, status, perfil, desc_especialidade, data_cad  } = req.body;
            console.log(req.body);
            const objPessoa = new Pessoa({ cpf, nome, data_nasc, genero, email, data_cad });
            if (data_nasc === null || data_nasc === "") {
                return res.json("Data de nascimento inválida!");
            } else {
                if (objPessoa.data_nasc == "Invalid Date" || !(objPessoa.data_nasc) instanceof Date) {
                    console.log("Erro!");
                    return res.json("Data de nascimento inválida!");
                }

            }
            console.log(logradouro, bairro, estado, numero, complemento, cep);


            const objEndereco = new Endereco({ id: null, logradouro: logradouro, bairro: bairro, estado: estado, numero: numero, complemento: complemento, cep: cep });

            console.log('HELP =>', objEndereco);

            let objTelefones = [];
            objTelefones.push(new Telefone({ id: null, numero: tel1 }));

            if (tel2 !== null || tel2 !== '') {
                objTelefones.push(new Telefone({ id: null, numero: tel2 }));
            }


            const objLogin = new Login({ id: null, login: login, senha: senha, status: status });

            const objPerfil = new Perfil({ id: null, tipo: perfil });

            let objEspecialidade = null;
            console.log("ola",data_admissao);
            var objFuncionario = new Funcionario({ id: null, data_admissao: data_admissao, crm: crm });
            console.log(objFuncionario)
            console.log(objFuncionario.data_admissao);
            if (objFuncionario.data_admissao === null || objFuncionario.data_admissao == "") {
                objFuncionario = null;
            } else {
                if (objFuncionario.data_admissao == "Invalid Date" || !(new Date(objFuncionario.data_admissao) instanceof Date)) {
                    console.log("Erro!");
                    return res.json("Data de admissão inválida!");
                }

                if (objFuncionario.crm !== null || objFuncionario.crm !== "") {
                    objEspecialidade = new Especialidade({ id: null, desc_especialidade: desc_especialidade });
                }

            }

            const result = await insert(objPessoa, objEndereco, objTelefones, objFuncionario, objLogin, objPerfil, objEspecialidade);

            if (result) {
                return res.render('pages/cadastro', { usuarioLogado: true, success: false, error: 'Erro ao cadastrar o cliente. Tente novamente.' });
            }

        } catch (error) {
            console.log(error);
            return res.render('pages/cadastro', { usuarioLogado: true, success: false, error: 'Ocorreu um erro ao cadastrar o cliente. Tente novamente.' });
        }

    },

    atualizarCliente: async (req, res) => {
        try {
            const cpf = req.params.cpf;
            const { nome, data_nasc, genero, email, endereco, telefone, funcionario } = req.body;
            const objPessoa = new Pessoa({ cpf, nome, data_nasc, genero, email });
            const objEndereco = new Endereco(endereco);
            const objTelefones = telefone.map(tel => new Telefone(tel));
            const objFuncionario = new Funcionario(funcionario);
            const result = await update(objPessoa, objEndereco, objTelefones, objFuncionario);
            return res.json(result);
        } catch (error) {
            console.log(error);
            res.json(error);
        }
    },

    deletarCliente: async (req, res) => {
        try {
            const cpf = req.params.cpf;
            const result = await remove(cpf);
            return res.json(result);
        } catch (error) {
            console.log(error);
            res.json(error);
        }
    },

    exibirTodos: async (req, res) => {
        try {
            const result = await findAll();
            return res.json(result);
        } catch (error) {
            console.log(error);
            res.json(error);
        }
    },

    exibirCliente: async (req, res) => {
        try {
            const cpf = req.params.cpf;
            const result = await buscarCpf(cpf);
            return res.json(result);
        } catch (error) {
            console.log(error);
            res.json(error);
        }
    },

    agendarConsulta: async (req, res) => {
        
        try {
            const { dataAgenda, horaAgenda, especialidade, medico, paciente } = req.body;

            // Verifica se todos os campos obrigatórios estão presentes
            if (!dataAgenda || !horaAgenda || !especialidade || !medico || !paciente ) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios." });
            }
            const consulta = new Consulta({
                dataAgenda,
                horaAgenda,
                paciente,
                medico,
            });
            console.log("Data:", dataAgenda); // Verificação dos valores
            console.log("Hora:", horaAgenda); // Verificação dos valores

            // Chama a função de agendamento
            const response = await agendarConsulta(consulta);
            console.log(response)

            const pacientes = await selecionaPacientesBd();
            const medicos = await selecionaMedicosBd();

            // Envia a resposta apropriada
            return res.render('pages/agendarConsulta',{medicos, pacientes,response});
        } catch (error) {
            console.log("Erro ao agendar consulta:", error);
            return res.status(500).json({ message: "Erro ao agendar consulta." });
        }
    },

    listarDetalhesPaciente: async (req, res) => {
        try {
          const pacienteId = req.params.id; // Obtém o ID do paciente da URL
          
          // Funções para buscar dados específicos
          const paciente = await buscarPacientePorId(pacienteId);
          const consultas = await buscarConsultasDoPaciente(pacienteId);
          const prontuario = await buscarProntuarioMaisRecente(pacienteId);
          
          // Renderiza a página com os dados obtidos
          res.render('pages/detalhesPaciente', { paciente, consultas, prontuario });
        } catch (error) {
          console.error('Erro ao carregar detalhes do paciente:', error);
          res.status(500).send('Erro ao carregar os detalhes.');
        }
      },

    listarAgendas: async (req, res) => {
        try {
            const consultas = await buscarTodasAgendas();
            function formatarData(data) {
                const date = new Date(data);
                const dia = String(date.getDate()).padStart(2, '0');
                const mes = String(date.getMonth() + 1).padStart(2, '0');
                const ano = date.getFullYear();
                return `${dia}/${mes}/${ano}`;
            };

            consultas.forEach(consulta => {
                consulta.data = formatarData(consulta.data);
            });

            res.render('pages/listarAgendas', { consultas });
            
            console.log(consultas)
        } catch (error) {
            console.error("Erro ao listar consultas:", error.message);
            res.status(500).send("Erro ao listar consultas.");
        }
    },

   listarpessoas: async (req, res) => {
        try {
            const pessoas = await buscarTodasPessoas();
            
            res.render('pages/pessoa', { pessoas });
            } catch (error) {
                console.error("Erro ao buscar pessoas:", error.message);
                res.status(500).send("Erro ao buscar pessoas.");
                }
    
    },


    deletarUsuario: async (req, res) => {
        const { userId, enderecoId } = req.body;
    
        if (!userId || !enderecoId) {
            return res.status(400).json({ error: 'ID do usuário e ID do endereço são necessários.' });
        }
    
        try {
            await deletarUsuario(userId, enderecoId);
            res.status(200).json({ message: `Usuário ${userId} deletado com sucesso.` });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar usuário.' });
        }
    },

    todosOsResultados: async (req, res) => {
        try {
            const consultas = await buscarTodasAgendas();

            function formatarData(data) {
                const date = new Date(data);
                const dia = String(date.getDate()).padStart(2, '0');
                const mes = String(date.getMonth() + 1).padStart(2, '0');
                const ano = date.getFullYear();
                return `${dia}/${mes}/${ano}`;
            };

            consultas.forEach(consulta => {
                consulta.data = formatarData(consulta.data);
            });


            res.render('pages/todosOsResultados', { consultas });
            
        } catch (error) {
            console.error("Erro ao buscar resultados:", error.message);
            res.status(500).send("Erro ao buscar resultados.");
        }
    },
}


module.exports = clienteController;
