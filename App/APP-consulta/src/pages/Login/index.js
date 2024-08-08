import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, Keyboard } from 'react-native';

const Login = ({ navigation }) => {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = () => {
        const users = [
            { login: '46298238856', senha: '1234', tipo: 'paciente' },
            { login: '34235256262', senha: '1234', tipo: 'medico' },
        ];

        const user = users.find(user => user.login === login && user.senha === senha);

        if (user) {
            if (user.tipo === 'paciente') {
                navigation.navigate('Paciente');
            } else if (user.tipo === 'medico') {
                navigation.navigate('Medico');
            }
        } else {
            Alert.alert('Erro', 'Credenciais inválidas. Verifique suas informações e tente novamente.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                
                <Text style={styles.title}>Bem-vindo</Text>
                <Text style={styles.subtitle}>Faça login para continuar</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Login"
                    placeholderTextColor="#9e9e9e"
                    value={login}
                    onChangeText={setLogin}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#9e9e9e"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.forgotButton}>
                    <Text style={styles.forgotButtonText}>Esqueceu sua senha?</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3f2fd',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0277bd',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#0288d1',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#81d4fa',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        backgroundColor: '#0288d1',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotButton: {
        marginTop: 20,
        alignSelf: 'center',
    },
    forgotButtonText: {
        color: '#0288d1',
        fontSize: 16,
    },
});

export default Login;
