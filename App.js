import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { f, auth, database } from "./Config/config";

import feed from "./app/screens/feed";
import upload from "./app/screens/upload.js";
import profile from "./app/screens/profile.js";
import userProfile from "./app/screens/userProfile.js";
import comments from "./app/screens/comments.js";

const TabStack = createBottomTabNavigator({
  Feed: { screen: feed },
  Upload: { screen: upload },
  Profile: { screen: profile }
});

const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    User: { screen: userProfile },
    Comments: { screen: comments }
  },
  {
    initialRouteName: "Home",
    mode: "modal",
    headerMode: "none"
  }
);
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
