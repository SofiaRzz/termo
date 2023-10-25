import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Button } from 'react-native';
import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component'
import TableWithTextInput from './TableWithTextInput';



export default function App() {
  const [palavra, setPalavra] = useState(null);

  async function fazerRequisicao() {
    const resposta = await fetch("https://api.dicionario-aberto.net/random");
    const json = await resposta.json();
    const palavraSorteada = json.word
    console.log(palavraSorteada)

    if (palavraSorteada.length === 5) {
      setPalavra(palavraSorteada)
    } else {
      fazerRequisicao()
    }
  }
  useEffect(() => {fazerRequisicao()}, [])
  //fazerRequisicao()
    
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

          <Text style={styles.titulo}>Termo</Text>
          <TableWithTextInput></TableWithTextInput>

        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  titulo: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}) 

