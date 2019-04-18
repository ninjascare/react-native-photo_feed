import React, { Component } from "react";
import { Flatlist, StyleSheet, Text, View, Image } from "react-native";

export default class profile extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Profile Page</Text>
      </View>
    );
  }
}
