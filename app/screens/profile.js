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
import PhotoList from "../components/PhotoList";

export default class profile extends Component {
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
          loggedIn: true,
          userId: user.uid
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
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 70,
                paddingTop: 30,
                backgroundColor: "white",
                borderColor: "lightgrey",
                borderBottomWidth: 0.5,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>Profile</Text>
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
                  uri: "https://api.adorable.io/avatars/285/test@user.i.png"
                }}
                style={{
                  marginLeft: 10,
                  width: 100,
                  height: 100,
                  borderRadius: 50
                }}
              />

              <View style={{ marginRight: 10 }}>
                <Text>name</Text>
                <Text>@username</Text>
              </View>
            </View>
            <View style={{ paddingBottom: 20, borderBottomWidth: 1 }}>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  marginHorizontal: 40,
                  paddingVertical: 15,
                  borderRadius: 20,
                  borderColor: "gray",
                  borderWidth: 1.5
                }}
              >
                <Text style={{ textAlign: "center", color: "gray" }}>
                  Logout
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  marginTop: 10,
                  marginHorizontal: 40,
                  paddingVertical: 15,
                  borderRadius: 20,
                  borderColor: "gray",
                  borderWidth: 1.5
                }}
              >
                <Text style={{ textAlign: "center", color: "gray" }}>
                  Edit Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Upload")}
                style={{
                  backgroundColor: "gray",
                  marginTop: 10,
                  marginHorizontal: 40,
                  paddingVertical: 15,
                  borderRadius: 20,
                  borderColor: "gray",
                  borderWidth: 1.5
                }}
              >
                <Text style={{ textAlign: "center", color: "white" }}>
                  Upload New +
                </Text>
              </TouchableOpacity>
            </View>
            <PhotoList
              isUser={true}
              userId={this.state.userId}
              navigation={this.props.navigation}
            />
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Please login to view your profile </Text>
          </View>
        )}
      </View>
    );
  }
}
