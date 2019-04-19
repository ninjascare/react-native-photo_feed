import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "react-navigation";
import feed from "./app/screens/feed"
import upload from "./app/screens/upload.js";
import profile from "./app/screens/profile.js";

const MainStack = createBottomTabNavigator({
  Feed: { screen: feed},
  Upload: { screen: upload },
  Profile: { screen: profile}
});

export default class App extends React.Component {
  render() {
    return (
      <MainStack />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
