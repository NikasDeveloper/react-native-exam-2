import React from 'react';
import { Alert, Button, StyleSheet, TouchableOpacity, View } from 'react-native';

export default class App extends React.Component {
  state = {
    x: 0,
    y: 50,
    width: 10,
    height: 10,
    timesAppeared: 0,
  };

  interval = null;

  setDimensions = async () => {
    fetch('http://rude.su.lt/~ramanauskaite/iip/keturkampis.php')
      .then(response => response.json())
      .then(({ x, y, width, height }) => {
        this.setState(prevState => ({
          width: width || prevState.width,
          height: height || prevState.height,
          x: x || prevState.x,
          y: y || prevState.y,
          timesAppeared: prevState.timesAppeared + 1,
        }));
      })
      .catch(error => console.log(error));
  };

  onStartPressed = async () => {
    if(!this.interval) {
      this.interval = setInterval(() => this.setDimensions(), 1000)
    }
  };

  onStopPressed = async () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.setState({
        x: 0,
        y: 50,
        width: 10,
        height: 10,
        timesAppeared: 0,
      });
    }
  };

  onFigurePressed = async () => {
    if(this.interval) {
      Alert.alert('Hello!', `Your figure appeared ${this.state.timesAppeared} times.`);
    }
  };

  render() {
    const { x, y, width, height } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.figureContainer}>
          <TouchableOpacity
            style={{
              ...styles.figure,
              width: width * 10,
              height: height * 10,
              top: `${y}%`,
              left: `${x}%`,
            }}
            onPress={this.onFigurePressed}>
          </TouchableOpacity>
        </View>
        <View style={styles.controlsContainer}>
          <Button
            title="Start"
            color="#000000"
            onPress={this.onStartPressed}
          />
          <Button
            title="Stop"
            color="#000000"
            onPress={this.onStopPressed}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  figureContainer: {
    flex: 5,
    zIndex: 1,
  },
  figure: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'green',
  },
  controlsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
