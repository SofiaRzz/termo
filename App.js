import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component'

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
    <View style={styles.container}>
      <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
        <Row>
          <Col><TextInput style={styles.input}/></Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Row>
      </Table>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}) 

