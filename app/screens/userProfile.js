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

export default class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  checkParams = () => {
    //
    let params = this.props.navigation.state.params;
    if (params) {
      if (params.userId) {
        this.setState({
          userId: params.userId
        });
        this.fetchUserInfo(params.userId);
      }
    }
  };

  fetchUserInfo = userId => {
    //
    var that = this;
    database
      .ref("users")
      .child(userId)
      .child("username")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;
        if (exists) data = snapshot.val();
        that
          .setState({
            username: data
          })
          .catch(error => console.log(error));
      });

    database
      .ref("users")
      .child(userId)
      .child("name")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;
        if (exists) data = snapshot.val();
        that
          .setState({
            name: data
          })
          .catch(error => console.log(error));
      });

    database
      .ref("users")
      .child(userId)
      .child("avatar")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;
        if (exists) data = snapshot.val();
        that
          .setState({
            avatar: data,
            loaded: true
          })
          .catch(error => console.log(error));
      });
  };

  componentDidMount = () => {
    this.checkParams();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loaded == false ? (
          <View>
            <Text>Loading..</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 70,
                paddingTop: 30,
                backgroundColor: "white",
                borderColor: "lightgrey",
                borderBottomWidth: 0.5,
                justifyContent: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={{ width: 100 }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "bold", paddingLeft: 10 }}
                >
                  Go Back
                </Text>
              </TouchableOpacity>
              <Text>Profile</Text>
              <Text style={{ width: 100 }} />
            </View>
            <View
              style={{
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "row",
                paddingVertical: 10
              }}
            >
              <Image
                source={{
                  uri: this.state.avatar
                }}
                style={{
                  marginLeft: 10,
                  width: 100,
                  height: 100,
                  borderRadius: 50
                }}
              />

              <View style={{ marginRight: 10 }}>
                <Text>{this.state.name}</Text>
                <Text>{this.state.username}</Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "lightblue"
              }}
            >
              <Text>Loading Photos</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
