import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, SafeAreaView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../../database/database'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const db = new DatabaseConnection.getConnection;

export default function NovoCliente() {
    const [nomeCliente, setNomeCliente] = useState('');
    const [dataNasc, setDataNasc] = useState("");
    const [telefone, setTelefone] = useState("");
    const [tipo, setTipo] = useState("");
    const [telefoneId, setTelefoneId] = useState("");
    const [clienteId, setClienteId] = useState("");

    const salvarRegistro = () => {
        if (nomeCliente.trim() === '') {
            Alert.alert('Erro', 'O nome do cliente deve ser preenchido');
            return;
        }
        if (dataNasc === null) {
            Alert.alert('Erro', 'Insira a data de nascimento');
            return;
        }

        db.transaction(
            tx => {
                tx.executeSql(
                    'INSERT INTO clientes (nome, data_nasc) VALUES (?,?)',
                    [nomeCliente, dataNasc],
                    (_, { insertId: clienteId }) => {

                        tx.executeSql(
                            'INSERT INTO tbl_telefones (numero, tipo) VALUES (?,?)',
                            [telefone, tipo],
                            (_, { insertId: telefoneId }) => {

                                tx.executeSql(
                                    'INSERT INTO telefones_has_clientes (telefone_id, cliente_id) VALUES (?,?)',
                                    [telefoneId, clienteId],
                                    (_, { rowsAffected }) => {
                                        
                                      
                                        Alert.alert('Info', 'Relacionamento incluído com sucesso');
                                    },
                                    (_, error) => {
                                        console.error('Erro ao adicionar relacionamento:', error);
                                        Alert.alert('Erro', 'Ocorreu um erro ao adicionar o relacionamento.');
                                    }
                                );

                            },
                            (_, error) => {
                                console.error('Erro ao adicionar telefone:', error);
                                Alert.alert('Erro', 'Ocorreu um erro ao adicionar o telefone.');
                            }
                        );

                    },
                    (_, error) => {
                        console.error('Erro ao adicionar cliente:', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao adicionar o cliente.');
                    }
                );
            }
        );

 

    }



    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.androidSafeArea}>
                <View style={styles.container}>

                    <View style={styles.viewTitle}>
                        <Text style={styles.title}>Novo registro</Text>
                    </View>

                    <TextInput
                        style={styles.input}
                        value={nomeCliente}
                        onChangeText={setNomeCliente}
                        placeholder="Informe o nome do Cliente"
                    />
                    <TextInput
                        style={styles.input}
                        value={dataNasc}
                        onChangeText={setDataNasc}
                        placeholder="Informe a data de nascimento"
                    />

                    <TextInput
                        style={styles.input}
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="Informe o telefone"
                    />

                    <TextInput
                        style={styles.input}
                        value={tipo}
                        onChangeText={setTipo}
                        placeholder="Informe o tipo"
                    />
                    <TouchableOpacity
                        style={styles.buttonSalvar}
                        onPress={salvarRegistro}
                    >
                        <Text style={styles.buttonTitle}>Cadastrar</Text>
                        <FontAwesome6 size={32} color="#FFF" />
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );

}


const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        marginTop: 10
    },
    container: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 15,
        gap: 10,
        borderRadius: 10,
        elevation: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    viewTitle: {
        alignItems: 'center',
        alignContent: 'center',
        width: '100%'
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonSalvar: {
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: "black",
        borderRadius: 8,
        elevation: 5,
        gap: 10,
        padding: 10,
    },
    buttonTitle: {
        backgroundColor: 'black',
        fontSize: 24,
        color: "#fff",
        fontWeight: "bold"
    },

});
