import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, TextInput, SafeAreaView, Button, Modal } from 'react-native';

export default function App() {
  const [attempts, setAttempts] = useState(0);
  const inputs = [useRef(), useRef(), useRef(), useRef(), useRef()];
  const [inputValues, setInputValues] = useState(['', '', '', '', '']);
  const [views, setViews] = useState([]);
  const [colors, setColors] = useState([]);
  const [count, setCount] = useState(0);
  const [palavraUsuario, setPalavraUsuario] = useState('');
  const [palavraSorteada, setPalavraSorteada] = useState(null);
  const [acertou, setAcertou] = useState(false);
  const [modalWinVisible, setModalWinVisible] = useState(false);
  const [modalDefeatVisible, setModalDefeatVisible] = useState(false);
  const [inputBackgroundColors, setInputBackgroundColors] = useState({
    0: '#FFFFFF',
    1: '#FFFFFF',
    2: '#FFFFFF',
    3: '#FFFFFF',
    4: '#FFFFFF',
  });

  this.inputs = inputs;



  async function fazerRequisicao() {
    const resposta = await fetch("https://api.dicionario-aberto.net/random");
    const json = await resposta.json();
    const palavra = 'bolar';
    // console.log(palavra);

    if (palavra.length === 5) {
      setPalavraSorteada(palavra);
      console.log('Palavra: ', palavra)

    } else {
      fazerRequisicao();
    }
  }
  useEffect(() => {
    fazerRequisicao();
  }, []);

  const restartGame = () => {
    setAttempts(0)
    setInputValues(['', '', '', '', ''])
    setViews([])
    setColors([])
    setCount(0)
    setPalavraUsuario('')
    setPalavraSorteada(null)
    setAcertou(false)
    setModalDefeatVisible(false)
    setModalWinVisible(false)
    setInputBackgroundColors(['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']);
    inputs[0].current.focus();
    fazerRequisicao()


  }

  const handleInputChange = (text, index) => {
    const textUpper = text.toUpperCase();
    const novoInputValues = [...inputValues];
    novoInputValues[index] = textUpper;
    setInputValues(novoInputValues);
    if (textUpper.length === 1 && index < inputValues.length - 1) {
      inputs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0) {
      inputs[index - 1].current.focus();
    }
  };

  const btnVerificar = async () => {
    const novaPalavraUsuario = inputValues.join('');
    console.log(novaPalavraUsuario)

    try {
      const resposta = await fetch(`https://api.dicionario-aberto.net/word/${novaPalavraUsuario.toLowerCase()}`)
      const json = await resposta.json();
      console.log(json[0].word)
      const letterColors = [];
      if (attempts > 0) {
        setCount(count + 1);
      }
      setPalavraUsuario(novaPalavraUsuario);
      const splitPSorteada = palavraSorteada.toUpperCase().split('');
      const splitPUsuario = novaPalavraUsuario.toUpperCase().split('');
  
      inputValues.forEach((value, index) => {
        const letraPU = splitPUsuario[index];
        const letraPS = splitPSorteada[index];
  
        if (letraPU === letraPS) {
          letterColors[index] = '#00FF00'; // Verde em formato hexadecimal
        } else if (splitPSorteada.includes(letraPU)) {
          letterColors[index] = '#FFFF00'; // Amarelo em formato hexadecimal
        } else {
          letterColors[index] = '#808080'; // Cinza em formato hexadecimal
        }
  
      });
  
      colors.push(letterColors);
      setColors(colors)
      console.log('Colors: ', colors)
  
      setInputBackgroundColors(letterColors);
  
      if (Object.values(letterColors).every((color) => color === '#00FF00')) {
        setModalWinVisible(true)
        setAcertou(true);
      } 
      
      else if (attempts < 5) {
        inputs[0].current.focus();
        setInputValues(['', '', '', '', '']);
        
        views.push(splitPUsuario)
        setViews(views);
        setAttempts(attempts + 1);
        setAcertou(false);
        console.log('Views: ', views)
      } 
      
      else {
        setModalDefeatVisible(true)
      }
      

    } catch (error) {
      console.log(error)
      alert('Palavra inválida')
      setPalavraUsuario('')
      console.log(novaPalavraUsuario)

    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Termo</Text>
        <Text style={styles.subtitulo}>Você tem {6 - attempts} tentativas restantes</Text>
        {!acertou ? (views.map((view, viewIndex) => (
          <View key={viewIndex} style={styles.inputContainer}>
            {view.map((value, index) => (
              <TextInput
                editable={false}
                key={index}
                style={[styles.input, { backgroundColor: colors[viewIndex][index] }]}
                value={value}
                maxLength={1}
              />
            ))}

          </View>
        ))) : null}
        <View style={styles.inputContainer}>
          {(inputValues.map((value, index) => (
            <TextInput
              key={index}
              ref={this.inputs[index]}
              style={[styles.input, {
                backgroundColor: acertou ? inputBackgroundColors[index] : 'white',
              }]}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              value={value}
              maxLength={1}
            />
          )))
          }
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalWinVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Você acertou!</Text>
              <Text style={styles.modalText}>A palavra era {palavraSorteada}</Text>
              <Pressable
                onPress={() => restartGame()}
                style={[styles.button, styles.buttonClose]}
              >
                <Text style={styles.textStyle}>Reiniciar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalDefeatVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Você perdeu!</Text>
              <Text style={styles.modalText}>A palavra era {palavraSorteada}</Text>
              <Pressable
                onPress={() => restartGame()}
                style={[styles.button, styles.buttonClose]}
              >
                <Text style={styles.textStyle}>Reiniciar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Button
          title="Verificar"
          onPress={btnVerificar}
        />
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
  subtitulo: {
    fontSize: 16,
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


  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

