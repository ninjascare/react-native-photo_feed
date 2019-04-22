import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "react-navigation";
import feed from "./app/screens/feed";
import upload from "./app/screens/upload.js";
import profile from "./app/screens/profile.js";
import { f, auth, database } from "./Config/config";

const MainStack = createBottomTabNavigator({
  Feed: { screen: feed },
  Upload: { screen: upload },
  Profile: { screen: profile }
});

export default class App extends React.Component {
  login = async () => {
    // force user to login
    try {
      let user = await auth.signInWithEmailAndPassword(
        "test@user.com",
        "password"
      );
    } catch (err) {
      console.log(err);
    }
  };

  constructor(props) {
    super(props);
    this.login();
  }

  render() {
    return <MainStack />;
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
