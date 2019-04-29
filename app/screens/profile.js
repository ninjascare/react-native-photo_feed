import React, { Component } from "react";
import {
  TextInput,
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

  fetchUserInfo = userId => {
    let that = this;
    database
      .ref("users")
      .child(userId)
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;
        if (exists) data = snapshot.val();
        that.setState({
          username: data.username,
          name: data.name,
          avatar: data.avatar,
          loggedIn: true,
          userId: userId
        });
      });
  };

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(user => {
      if (user) {
        // logged in
        that.fetchUserInfo(user.uid);
      } else {
        // not logged in
        that.setState({
          loggedIn: false
        });
      }
    });
  };

  logOutUser = () => {
    f.auth().signOut();
    alert("LoggedOut");
  };

  editProfile = () => {
    this.setState({
      editingProfile: true
    });
  };

  saveProfile = () => {
    let name = this.state.name;
    let username = this.state.username;

    if (name != "") {
      database
        .ref("users")
        .child(this.state.userId)
        .child("name")
        .set(name);
    }
    if (username != "") {
      database
        .ref("users")
        .child(this.state.userId)
        .child("username")
        .set(username);
    }
    this.setState({
      editingProfile: false
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
            {this.state.editingProfile == true ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: 20,
                  borderBottomWidth: 1
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      editingProfile: false
                    })
                  }
                >
                  <Text style={{ fontWeight: "bold", color: "red" }}>
                    {" "}
                    Cancel editing
                  </Text>
                </TouchableOpacity>
                <Text>Name:</Text>
                <TextInput
                  editable={true}
                  placeholder="Enter your name.."
                  onChangeText={text =>
                    this.setState({
                      name: text
                    })
                  }
                  value={this.state.name}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "gray",
                    borderWidth: 1
                  }}
                />
                <Text>Username:</Text>
                <TextInput
                  editable={true}
                  placeholder="Enter your username.."
                  onChangeText={text =>
                    this.setState({
                      username: text
                    })
                  }
                  value={this.state.username}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "gray",
                    borderWidth: 1
                  }}
                />
                <TouchableOpacity
                  style={{ backgroundColor: "blue", padding: 10 }}
                  onPress={() => this.saveProfile()}
                >
                  <Text style={{ fontWeight: "bold", color: "white" }}>
                    Save Changes
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
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
                  <Text
                    onPress={() => this.logOutUser()}
                    style={{ textAlign: "center", color: "gray" }}
                  >
                    Logout
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.editProfile()}
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
            )}
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
