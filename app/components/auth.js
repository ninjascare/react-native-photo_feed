import React, { Component } from "react";
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  View
} from "react-native";
import { f, auth, database, storage } from "../../Config/config";

export default class UserAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authStep: 0,
      email: "",
      pass: "",
      moveScreen: false
    };
  }

  componentDidMount = () => {};

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>You are not logged in!!</Text>
        <Text>{this.props.message}</Text>
      </View>
    );
  }
}
