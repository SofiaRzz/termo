import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, TextInput, SafeAreaView, Button, Modal, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';


export default function App() {
  const [fontsLoaded] = useFonts({
    'InterTight-Black': require('./assets/fonts/InterTight-Black.ttf'),
    'InterTight-Bold': require('./assets/fonts/InterTight-Bold.ttf'),
    'InterTight-ExtraBold': require('./assets/fonts/InterTight-ExtraBold.ttf'),
    'InterTight-ExtraLight': require('./assets/fonts/InterTight-ExtraLight.ttf'),
    'InterTight-Light': require('./assets/fonts/InterTight-Light.ttf'),
    'InterTight-Medium': require('./assets/fonts/InterTight-Medium.ttf'),
    'InterTight-Regular': require('./assets/fonts/InterTight-Regular.ttf'),
    'InterTight-SemiBold': require('./assets/fonts/InterTight-SemiBold.ttf'),
    'InterTight-Thin': require('./assets/fonts/InterTight-Thin.ttf'),
});

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
  const [modalExplicacaoVisible, setModalExplicacaoVisible] = useState(false);
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
    const palavra = json.word;

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

  const explicacao = () => {
    setModalExplicacaoVisible(true);
  };
  
  const closeModalExplicacao = () => {
    setModalExplicacaoVisible(false);
  };

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
          letterColors[index] = '#8f9044'; // Verde em formato hexadecimal
        } else if (splitPSorteada.includes(letraPU)) {
          letterColors[index] = '#f8a523'; // Amarelo em formato hexadecimal
        } else {
          letterColors[index] = '#626869'; // Cinza em formato hexadecimal
        }
  
      });
  
      colors.push(letterColors);
      setColors(colors)
      console.log('Colors: ', colors)
  
      setInputBackgroundColors(letterColors);
  
      if (Object.values(letterColors).every((color) => color === '#8f9044')) {
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
        <View style={styles.duvidaContainer}>
          <TouchableOpacity style={styles.btnDuvida} onPress={explicacao}>
            <Text style={styles.interrogacao}>?</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.titulo}>TERMO</Text>
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
          {palavraSorteada ? (inputValues.map((value, index) => (
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
          ))) : (inputValues.map((value, index) => (
            <TextInput
              key={index}
              editable={false}
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
                <Text style={styles.textStyle}>REINICIAR</Text>
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
                <Text style={styles.textStyle}>REINICIAR</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalExplicacaoVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalExplicacao}>
              <Text style={styles.modalText}>Seu objetivo é descobrir a palavra secreta em 6 tentativas</Text>
              <Text style={styles.modalText}>Se uma letra está VERDE ela existe na palavra secreta e está no lugar correto</Text>
              <Text style={styles.modalText}>Se uma letra está AMARELA ela existe na palavra secreta, mas em outro lugar</Text>
              <Text style={styles.modalText}>Se uma letra está CINZA ela não existe na palavra secreta</Text>
              <Text style={styles.modalText}>ATENÇÃO: Você deve acentuar palavras que tenham acento </Text>
              
              <Pressable
                onPress={closeModalExplicacao}
                style={[styles.button, styles.buttonClose]}
              >
                <Text style={styles.textStyle}>ENTENDI</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={btnVerificar} style={styles.btnVerificar}>
          <Text style={styles.textStyle}>VERIFICAR</Text>
          </TouchableOpacity>

        <StatusBar style="auto" />
      </View>

    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#352f3d',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titulo: {
    color: 'white',
    fontSize: 30,
    marginBottom: 10,
    fontFamily: 'InterTight-ExtraBold',
  },

  subtitulo: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'InterTight-Medium',
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

  duvidaContainer: {
    position: 'absolute',
    top: 50,
    right: -30,
  },

  btnDuvida: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 1,
  },

  btnVerificar: {
    backgroundColor: '#fc8020',
    padding: 10,
    borderRadius: 20,
    
  },

  interrogacao: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
  },

  modalExplicacao: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
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
    backgroundColor: '#fc8020',
  },

  textStyle: {
    color: 'white',
    fontFamily: 'InterTight-SemiBold',
    textAlign: 'center',
  },

  modalText: {
    fontFamily: 'InterTight-Regular',
    marginBottom: 15,
    textAlign: 'center',
  },
});

