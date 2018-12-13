import React from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class App extends React.Component {
  state = {
    tasks: [],
  };

  interval = null;

  getRandomNumber(limit = 20) {
    return Math.floor(Math.random() * limit) + 1;
  }

  setTasks = async () => {
    fetch('http://rude.su.lt/~ramanauskaite/iip/uzduotys.php')
      .then(response => response.json())
      .then(tasks => {
        this.setState({
          tasks: tasks.map(task => ({
            ...task,
            x: this.getRandomNumber(50),
            y: this.getRandomNumber(20),
          }))
        });
      })
      .catch(error => console.log(error));
  };

  updateTaskCords = async () => {
    this.setState({
      tasks: this.state.tasks.map(task => ({
        ...task,
        x: this.getRandomNumber(50),
        y: this.getRandomNumber(20),
      }))
    })
  };

  onStartPressed = async () => {
    if (!this.interval) {
      this.interval = setInterval(() => this.state.tasks.length ? this.updateTaskCords() : this.setTasks(), 1000)
    }
  };

  onStopPressed = async () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  onTaskPressed = async (task) => {
    if (this.interval) {
      Alert.alert('Hello!', `Your task is - ${task.pavadinimas}.`);
    }
  };

  render() {
    const { tasks } = this.state;
    const tasksComponent = tasks.map(task => (
      <TouchableOpacity
        style={{
          ...styles.task,
          top: `${task.x}%`,
          left: `${task.y}%`,
        }}
        key={task.id}
        onPress={() => this.onTaskPressed(task)}>
        <Text>{task.terminas}</Text>
      </TouchableOpacity>
    ));

    return (
      <View style={styles.container}>
        <View style={styles.tasksContainer}>
          {tasksComponent}
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
  tasksContainer: {
    flex: 5,
    zIndex: 1,
  },
  task: {
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
