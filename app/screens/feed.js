import React, { Component } from "react";
import { Flatlist, StyleSheet, Text, View, Image } from "react-native";

export default class feed extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Feed Page</Text>
      </View>
    );
  }
}
