/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImagePickerIOS,
  Image,
  TouchableOpacity
} from "react-native";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

export default class App extends Component {
  state = {
    image: null
  };

  chooseImageFromGallery = () => {
    ImagePickerIOS.openSelectDialog(
      {},
      imageUri => {
        this.setState({ image: imageUri });
      },
      error => console.log(error)
    );
  };
  chooseImageFromCamera = () => {
    ImagePickerIOS.openCameraDialog(
      {},
      imageUri => {
        this.setState({ image: imageUri });
      },
      error => console.log(error)
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {this.state.image ? (
            <Image style={{ flex: 1 }} source={{ uri: this.state.image }} />
          ) : null}
        </View>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={this.chooseImageFromGallery}>
            <Text style={styles.buttonText}>Open From Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.chooseImageFromCamera}>
            <Text style={styles.buttonText}>Open From Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  button: {
    backgroundColor: "gray",
    width: 150,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  buttonText: {
    color: "white"
  }
});
