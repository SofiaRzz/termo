import React, { Component } from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';

class TableWithTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Array(5).fill(null).map(() => Array(5).fill('')),
    };
  }

  handleChangeText = (text, row, col) => {
    const newData = [...this.state.data];
    newData[row][col] = text;
    this.setState({ data: newData });
    console.log(this.state.data);
  }

  renderCell = ({ item, index }) => {
    return (
      <View style={styles.cell}>
        <TextInput
          style={styles.textInput}
          value={item}
          onChangeText={(text) => this.handleChangeText(text, Math.floor(index / 5), index % 5)}
        />
      </View>
    );
  }

  render() {
    return (
      <FlatList

        data={this.state.data.flat()}
        numColumns={5}
        renderItem={this.renderCell}
        keyExtractor={(item, index) => `${index}`}
        contentContainerStyle={styles.container}
      />
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',

  },
  cell: {
    flex: 1,
    padding: 35,
    borderWidth: 1,
    borderColor: 'gray',
  },
  textInput: {

    width: 50, 
    height: 20, 
    textAlign: 'center',
 
  },
});

export default TableWithTextInput;