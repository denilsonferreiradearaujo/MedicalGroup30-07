import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PacienteConsultas = () => {
    const [consultas, setConsultas] = useState([]);
    const [paciente, setPaciente] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simular a obtenção de dados
        const fetchPacienteData = async () => {
            try {
                // Dados simulados
                const simulatedPacienteData = {
                    nome: 'Ana Costa',
                    cpf: '123.456.789-00',
                    email: 'ana.costa@exemplo.com',
                    telefone: '(11) 98765-4321'
                };

                const simulatedConsultasData = [
                    {
                        id: 1,
                        data: '2024-08-10',
                        medico: {
                            nome: 'Dr. João Silva',
                            especialidade: 'Cardiologista'
                        }
                    },
                    {
                        id: 2,
                        data: '2024-08-15',
                        medico: {
                            nome: 'Dr. Maria Oliveira',
                            especialidade: 'Dermatologista'
                        }
                    }
                ];

                setPaciente(simulatedPacienteData);
                setConsultas(simulatedConsultasData);
            } catch (err) {
                setError('Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        fetchPacienteData();
    }, []);

    const refreshData = () => {
        setLoading(true);
        setError(null);
        fetchPacienteData();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0288d1" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={refreshData} style={styles.refreshButton}>
                    <Icon name="refresh" size={24} color="#fff" />
                    <Text style={styles.refreshButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.pacienteInfo}>
                <Text style={styles.title}>Informações do Paciente</Text>
                <Text style={styles.infoText}>Nome: {paciente.nome || 'Não disponível'}</Text>
                <Text style={styles.infoText}>CPF: {paciente.cpf || 'Não disponível'}</Text>
                <Text style={styles.infoText}>Email: {paciente.email || 'Não disponível'}</Text>
                <Text style={styles.infoText}>Telefone: {paciente.telefone || 'Não disponível'}</Text>
            </View>

            <View style={styles.consultasContainer}>
                <Text style={styles.title}>Consultas Agendadas</Text>
                {consultas.length > 0 ? (
                    <FlatList
                        data={consultas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.consulta}>
                                <Text style={styles.consultaText}>Data: {item.data}</Text>
                                <Text style={styles.consultaText}>Médico: {item.medico.nome}</Text>
                                <Text style={styles.consultaText}>Especialidade: {item.medico.especialidade}</Text>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noConsultasText}>Sem consultas agendadas</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#e3f2fd',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#0288d1',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0288d1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    pacienteInfo: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        elevation: 2,
    },
    consultasContainer: {
        flex: 1,
    },
    consulta: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#81d4fa',
        borderRadius: 8,
        marginVertical: 8,
        backgroundColor: '#ffffff',
    },
    consultaText: {
        fontSize: 16,
        color: '#333',
    },
    noConsultasText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#0277bd',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
});

export default PacienteConsultas;
