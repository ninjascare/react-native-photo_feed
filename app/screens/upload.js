import React, { Component } from "react";
import {
  TouchableOpacity,
  Flatlist,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";
import { f, auth, database, storage } from "../../Config/config";

export default class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  findNewImage = () => {
    //
  };

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
      <View style={{ flex: 1 }}>
        {this.state.loggedIn == true ? (
          // are loggeed in
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 28, paddingBottom: 15 }}>Upload Page</Text>
            <TouchableOpacity
              onPress={() => this.findNewImage()}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "blue",
                borderRadius: 5
              }}
            >
              <Text style={{ color: "white" }}>Select Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Please login to upload new content</Text>
          </View>
        )}
      </View>
    );
  }
}
