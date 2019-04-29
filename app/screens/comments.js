import React, { Component } from "react";
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";
import { f, auth, database, storage } from "../../Config/config";

export default class comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      comment_list: []
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
    this.checkParams();
  };

  checkParams = () => {
    //
    let params = this.props.navigation.state.params;
    if (params) {
      if (params.photoId) {
        this.setState({
          photoId: params.photoId
        });
        this.fetchComments(params.photoId);
      }
    }
  };

  addCommentsToList = (comment_list, data, comment) => {
    let that = this;
    let commentObj = data[comment];
    database
      .ref("users")
      .child(commentObj.author)
      .child("username")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;
        if (exists) data = snapshot.val();
        comment_list.push({
          id: comment,
          comment: commentObj.comment,
          posted: that.timeConverter(commentObj.posted),
          author: data,
          authorId: commentObj.author
        });
        that.setState({
          refresh: false,
          loading: false
        });
      })
      .catch(err => console.log(err));
    console.log(comment_list, data, comment);
  };

  fetchComments = photoId => {
    let that = this;
    database
      .ref("comments")
      .child(photoId)
      .orderByChild("posted")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;
        if (exists) {
          // add comments to flatlist
          data = snapshot.val();
          let comment_list = this.state.comment_list;
          for (let comment in data) {
            that.addCommentsToList(comment_list, data, comment);
          }
        } else {
          // are no comment_list
          that.setState({
            comment_list: []
          });
        }
      })
      .catch(error => console.log(error));
  };

  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  uniqueId = () => {
    return (
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4()
    );
  };

  pluralCheck = s => {
    if (s == 1) {
      return "ago";
    } else {
      return "s ago";
    }
  };

  timeConverter = timestamp => {
    let a = new Date(timestamp * 1000);
    let seconds = Math.floor((new Date() - a) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + "year" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + "month" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + "day" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + "hour" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + "minute" + this.pluralCheck(interval);
    }
    return Math.floor(seconds) + "second" + this.pluralCheck(seconds);
  };

  postComment = () => {};

  render() {
    return (
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
            <Text style={{ fontSize: 12, fontWeight: "bold", paddingLeft: 10 }}>
              Go Back
            </Text>
          </TouchableOpacity>
          <Text>Comments</Text>
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
        {this.state.comment_list.length == 0 ? (
          //    no comments show empty state
          <Text>No Comments found...</Text>
        ) : (
          //     there are comments
          <FlatList
            refreshing={this.state.refresh}
            data={this.state.comment_list}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1, backgroundColor: "#eee" }}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  width: "100%",
                  overFlow: "hidden",
                  marginBottom: 5,
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderColor: "grey"
                }}
              >
                <View
                  style={{
                    padding: 5,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text>{item.posted}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("User", {
                        userId: item.authorId
                      })
                    }
                  >
                    <Text>{item.author}</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    padding: 5
                  }}
                >
                  <Text>{item.comment}</Text>
                </View>
              </View>
            )}
          />
        )}
        {this.state.loggedIn == true ? (
          // are loggeed in
          <KeyboardAvoidingView
            behavior="padding"
            enabled
            style={{
              borderTopWidth: 1,
              borderTopColor: "grey",
              padding: 10,
              marginBottom: 15
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Post Comment</Text>
            <View>
              <TextInput
                editable={true}
                placeholder="Enter your comment here ..."
                onChangeText={text =>
                  this.setState({
                    comment: text
                  })
                }
                style={{
                  marginVertical: 10,
                  height: 50,
                  padding: 5,
                  borderColor: "grey",
                  borderRadius: 3,
                  backgroundColor: "white",
                  color: "black"
                }}
              />
              <TouchableOpacity onPress={() => this.postComment()}>
                <Text>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View>
            <Text>Please login to post a comment</Text>
          </View>
        )}
      </View>
    );
  }
}
