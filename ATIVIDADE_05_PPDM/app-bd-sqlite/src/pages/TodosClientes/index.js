import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, SafeAreaView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../../database/database';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'

const db = new DatabaseConnection.getConnection;

export default function TodosClientes() {
    const route = useRoute();

    const [todos, setTodos] = useState([]);
    const [textPesquisa, setTextPesquisa] = useState(null);
    const [refresh, setRefresh] = useState(route.params?.refresh ? route.params.setRefresh : false);

    const navigation = useNavigation();

    const newItem = () => {
        navigation.navigate('NovoCliente');
    }

    useFocusEffect(
        useCallback(() => {
            if (todos.length !== 0) {
                mostraRegistros();
            }
        }, [refresh])
    )
    const mostraRegistros = () => {
        try {
            db.transaction(tx => {
                tx.executeSql(`SELECT 
                C.ID AS ID_CLIENTE,
                C.NOME,
                C.DATA_NASC,
                T.NUMERO,
                T.TIPO
            FROM CLIENTES AS C
                INNER JOIN telefones_has_clientes AS TC ON C.ID = TC.CLIENTE_ID
                INNER JOIN tbl_telefones AS T ON TC.TELEFONE_ID = T.ID;`,
                    [],
                    (_, { rows }) => {
                        setTodos(rows._array);
                        console.log(rows._array);
                    }
                );
            });
        } catch (error) {
            console.error('Erro ao buscar todos:', error);
        }
    };

    const pesquisaRegistros = () => {
        try {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT c.* FROM clientes AS c " +
                    "JOIN telefones_has_clientes AS thc ON c.id = thc.cliente_id " +
                    "JOIN tbl_telefones AS t ON thc.telefone_id = t.id " +
                    "WHERE c.nome LIKE ? OR t.numero LIKE ?",
                    [`%${textPesquisa}%`, `%${textPesquisa}%`],
                    (_, { rows }) => {
                        setTodos(rows._array);
                    }
                );
            });
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    useEffect(() => {
        pesquisaRegistros();

    }, [textPesquisa]);

    useEffect(() => {
        mostraRegistros();
    }, []);

    const handleButtonPress = (dados) => {
        navigation.navigate('EditItem', dados);
    };

    const exclui = id => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'DELETE FROM clientes WHERE id = ?',
                    [id],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            pesquisaRegistros();
                            Alert.alert('Sucesso', 'Registro excluído com sucesso.');
                        } else {
                            Alert.alert('Erro', 'Nenhum registro foi excluído, vertifique e tente novamente!');
                        }
                    },
                    (_, error) => {
                        console.error('Erro ao excluir cliente:', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao excluir o cliente.');
                    }
                );
            }
        );
    };



    return (
        <SafeAreaView style={styles.androidSafeArea}>
            <View>
                <Text style={styles.title}>Clientes Cadastrados</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingBottom: 10 }}>
                <TextInput
                    onChangeText={setTextPesquisa}
                    value={textPesquisa}
                    style={styles.inputSearch}
                    placeholder='Informe o nome ou o telefone do cliente'
                />
            </View>

            <ScrollView contentContainerStyle={styles.containerScroll}>
                {todos.map(cliente => (
                    <View key={cliente.id} style={[styles.containerFilmes]}>
                        <View style={styles.logoFilmes}>
                            <FontAwesome6 name='user' color={'black'} size={72} />
                        </View>
                        <View style={styles.clienteItem}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{cliente.nome}</Text>
                            <View style={styles.alinharEmLinha}>
                                <Text style={{ fontWeight: 'bold' }}>Telefone: </Text>
                                <Text>{cliente.numero}</Text>
                            </View>
                            <View style={styles.alinharEmLinha}>
                                <Text style={{ fontWeight: 'bold' }}>Tipo: </Text>
                                <Text>{cliente.tipo}</Text>
                            </View>
                            <View style={styles.viewButtonTable}>
                                <TouchableOpacity
                                    style={[styles.alinharEmLinha]}
                                    onPress={() => {
                                        Alert.alert(
                                            "Atenção!",
                                            'Deseja excluir o registro selecionado?',
                                            [
                                                {
                                                    text: 'OK',
                                                    onPress: () => exclui(cliente.id)
                                                },
                                                {
                                                    text: 'Cancelar',
                                                    onPress: () => { return },
                                                    style: 'cancel',
                                                }
                                            ],
                                        )
                                    }}>
                                    <FontAwesome6 name='trash-can' color={'#f5554a'} size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.alinharEmLinha]}
                                    onPress={() => { handleButtonPress({ nome: cliente.nome, telefone: cliente.telefone, tipo: cliente.tipo, id: cliente.id }) }}>
                                    <FontAwesome6 name='pen-to-square' color={'#114264'} size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20, position: 'relative', elevation: 5 }}>
                <TouchableOpacity
                    style={[styles.alinharEmLinha, styles.buttonNovoCliente]}
                    onPress={newItem}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>Cadastrar cliente</Text>
                    <FontAwesome6 name='plus' color={'white'} size={24} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        marginTop: 10
    },
    alinharEmLinha: {
        flexDirection: 'row',
        alignContent: "flex-start",
        alignItems: 'center'
    },
    container: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 15,
        gap: 10,
        borderRadius: 10,
        elevation: 5,
        marginTop: 5
    }
    ,
    containerFilmes: {
        width: '90%',
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        gap: 10,
        borderRadius: 10,
        elevation: 5,
        marginTop: 5
    },
    containerScroll: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 20,
        gap: 15,

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    clienteItem: {
        width: "75%",
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 5
    },
    viewButtonTable: {
        width: '100%',
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'flex-end',
        marginBottom: -5,

    },
    buttonTable: {
        borderRadius: 8,
    },
    buttonNovoCliente: {
        backgroundColor: 'black',
        borderRadius: 8,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        height: 50,
        gap: 15,
        elevation: 3

    },
    logoFilmes: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputSearch: {
        width: '90%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 5,
        borderRadius: 5,
        backgroundColor: "#fafafa",
        fontSize: 16,
        color: "#333",
        textAlign: 'center'
    },


});
