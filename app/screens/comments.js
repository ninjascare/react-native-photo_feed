import React, { Component } from "react";
import { Flatlist, StyleSheet, Text, View, Image } from "react-native";
import { f, auth, database, storage } from "../../Config/config";

export default class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(user => {
      if (user) {
        // logged in
        that.setState({
          loggedIn: true
        });
      } else {
        // not logged in
        that.setState({
          loggedIn: false
        });
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {this.state.loggedIn == true ? (
          // are loggeed in
          <Text>Comment Page</Text>
        ) : (
          <View>
            <Text>Please login to post a comment</Text>
          </View>
        )}
      </View>
    );
  }
}
