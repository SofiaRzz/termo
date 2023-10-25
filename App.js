import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Button } from 'react-native';

export default function App() {
  const inputs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  this.inputs = inputs;
  const [inputValues, setInputValues] = useState(['', '', '', '', '']); 
  const [inputBackgroundColors, setInputBackgroundColors] = useState(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
  const [palavraUsuario, setPalavraUsuario] = useState('');
  const [palavraSorteada, setPalavraSorteada] = useState(null);

  async function fazerRequisicao() {
    const resposta = await fetch("https://api.dicionario-aberto.net/random");
    const json = await resposta.json();
    const palavra = json.word
    console.log(palavra)

    if (palavra.length === 5) {
      setPalavraSorteada(palavra)
    } else {
      fazerRequisicao()
    }
  }

  useEffect(() => {
    fazerRequisicao()
  }, [])

  const handleInputChange = (text, index) => {
    const novoInputValues = [...inputValues];
    novoInputValues[index] = text;
    setInputValues(novoInputValues);
  
    if (text.length === 1 && index < inputValues.length - 1) {
      // Se uma letra foi digitada e não estamos no último TextInput, mude o foco para o próximo
      inputs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0) {
      // Se a tecla Backspace for pressionada e não estiver no primeiro TextInput, retorne o foco ao TextInput anterior
      inputs[index - 1].current.focus();
    }
  };

  const btnVerificar = () => {
    setPalavraUsuario(inputValues.join(''));
    const splitPSorteada = palavraSorteada.toUpperCase().split('');
    const splitPUsuario = palavraUsuario.toUpperCase().split('');
  
    const newInputBackgroundColors = [...inputBackgroundColors];
  
    inputValues.forEach((value, index) => {
      const letraPU = value.toUpperCase();
      const letraPS = splitPSorteada[index];
  
      if (letraPU === letraPS) {
        newInputBackgroundColors[index] = '#00FF00'; // Verde em formato hexadecimal
      } else if (splitPSorteada.includes(letraPU)) {
        newInputBackgroundColors[index] = '#FFFF00'; // Amarelo em formato hexadecimal
      } else {
        newInputBackgroundColors[index] = '#808080'; // Cinza em formato hexadecimal
      }
    });
  
    setInputBackgroundColors(newInputBackgroundColors);
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Termo</Text>
        <View style={styles.inputContainer}>
          {inputValues.map((value, index) => (
            <TextInput
              key={index}
              ref={this.inputs[index]}
              style={[styles.input, { backgroundColor: inputBackgroundColors[index] }]}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              value={value}
              maxLength={1}
            />
          ))}
        </View>
        <Button
          title="VERIFICAR"
          onPress={btnVerificar}
        />
        <Text style={styles.resultText}>{palavraUsuario}</Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 20,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: 50,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    borderRadius: 3,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
  },
});

