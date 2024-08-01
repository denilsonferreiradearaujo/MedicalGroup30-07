import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    FlatList
} from 'react-native';
import api from '../../service/api';

const Medico = ({ route }) => {
    const [consultas, setConsultas] = useState([]);
    const [medico, setMedico] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [medicoId, setMedicoId] = useState(null);

    // Acessa o parâmetro `email` de forma segura
    const { email } = route.params || {};

    useEffect(() => {
        console.log('Parâmetros da rota:', route.params); // Verifique se os parâmetros estão corretos

        if (!email) {
            Alert.alert('Erro', 'Email do médico não fornecido.');
            setLoading(false); // Para evitar que a tela continue carregando
            return;
        }

        const fetchMedicoId = async () => {
            try {
                const response = await api.get(`/medicos/byEmail/${email}`);
                const id = response.data.id; // Ajuste conforme a estrutura da resposta da API
                setMedicoId(id);
            } catch (err) {
                setError('Erro ao buscar ID do médico');
                Alert.alert('Erro', 'Não foi possível obter o ID do médico.');
                setLoading(false);
            }
        };

        fetchMedicoId();
    }, [email]);

    useEffect(() => {
        if (!medicoId) return;

        const fetchMedicoData = async () => {
            try {
                const medicoResponse = await api.get(`/todosOsResultadosMobile/${medicoId}`);
                setMedico(medicoResponse.data);

                const consultasResponse = await api.get(`/consultas/medico/${medicoId}`);
                setConsultas(consultasResponse.data);
            } catch (err) {
                setError('Erro ao carregar dados');
                Alert.alert('Erro', 'Não foi possível carregar os dados do médico e consultas.');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicoData();
    }, [medicoId]);

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
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.medicoInfo}>
                <Text style={styles.title}>Informações do Médico</Text>
                <Text style={styles.infoText}>Nome: {medico.nome || 'Não disponível'}</Text>
                <Text style={styles.infoText}>CPF: {medico.cpf || 'Não disponível'}</Text>
                <Text style={styles.infoText}>Email: {medico.email || 'Não disponível'}</Text>
                <Text style={styles.infoText}>Telefone: {medico.telefone || 'Não disponível'}</Text>
                <Text style={styles.infoText}>Especialidade: {medico.especialidade || 'Não disponível'}</Text>
            </View>

            <View style={styles.consultasContainer}>
                <Text style={styles.title}>Consultas</Text>
                {consultas.length > 0 ? (
                    <FlatList
                        data={consultas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.consulta}>
                                <Text style={styles.consultaText}>Data: {item.data}</Text>
                                <Text style={styles.consultaText}>Paciente: {item.paciente}</Text>
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
    medicoInfo: {
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

export default Medico;
