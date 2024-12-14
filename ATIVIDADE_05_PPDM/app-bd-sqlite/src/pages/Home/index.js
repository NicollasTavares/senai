import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, SafeAreaView, Platform, TouchableOpacity, Image } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../../database/database'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'

const db = new DatabaseConnection.getConnection;


export default function App() {
    const navigation = useNavigation();

    const TodosClientes = () => {
        navigation.navigate('TodosClientes');
    }

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, data_nasc DATE NOT NULL)",
                [], 
                () => console.log('Tabela criada com sucesso'),
                (_, error) => console.error(error)
            );
        });
    }, []);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tbl_telefones (id INTEGER PRIMARY KEY AUTOINCREMENT, numero TEXT NOT NULL, tipo TEXT NOT NULL)",
                [], 
                () => console.log('Tabela criada com sucesso'),
                (_, error) => console.error(error)
            );
        });
    }, []);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS telefones_has_clientes (telefone_id INTEGER NOT NULL, cliente_id INTEGER NOT NULL, FOREIGN KEY (telefone_id) REFERENCES tbl_telefone (id), FOREIGN KEY (cliente_id) REFERENCES clientes (id))",
                [], 
                () => console.log('Tabela criada com sucesso'),
                (_, error) => console.error(error)
            );
        });
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.androidSafeArea}>
                <View style={styles.container}>

                    <Image
                        source={require('../../../assets/logo.jpg')}
                        style={{ width: 150, height: 150, borderRadius: 50 }}
                    />

                    <Text style={styles.title}>Cadastro de clientes</Text>


                    <TouchableOpacity
                        style={styles.button}
                        onPress={TodosClientes}
                    >
                        <Text style={styles.textButton}>Acessar</Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        </SafeAreaProvider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '100%',
        gap: 40
    },
    androidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        marginTop: 10,
        backgroundColor: '#fff'
    },

    textButton: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: 'bold'
    },

    button: {
        borderRadius: 10,
        backgroundColor: "blue",
        height: 60,
        width: '50%',
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        elevation: 7,
        marginBottom: 30
    }

});