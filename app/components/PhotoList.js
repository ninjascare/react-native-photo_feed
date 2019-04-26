import React, { Component } from "react";
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";
import { f, auth, database, storage } from "../../Config/config";

export default class PhotoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true
    };
  }

  componentDidMount() {
    const { isUser, userId } = this.props;
    if (isUser == true) {
      //     Profile
      // userId
      this.loadFeed(userId);
    } else {
      this.loadFeed("");
    }
  }

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

  addToFlatlist = (photo_feed, data, photo) => {
    let that = this;
    let photoObj = data[photo];
    database
      .ref("users")
      .child(photoObj.author)
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;
        if (exists) data = snapshot.val();
        photo_feed.push({
          id: photo,
          url: photoObj.url,
          caption: photoObj.caption,
          posted: that.timeConverter(photoObj.posted),
          author: data.username,
          authorId: photoObj.author
        });
        that.setState({
          refresh: false,
          loading: false
        });
      })
      .catch(error => console.log('Error FOool',error));
  };

  loadFeed = (userId = "") => {
    this.setState({
      refresh: true,
      photo_feed: []
    });

    let that = this;
    let loadRef = database.ref("photos");

    if (userId != "") {
      loadRef = database
        .ref("users")
        .child(userId)
        .child("photos");
    }

    loadRef
      .orderByChild("posted")
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() != null;
        if (exists) data = snapshot.val();
        let photo_feed = that.state.photo_feed;

        for (let photo in data) {
          that.addToFlatlist(photo_feed, data, photo);
        }
      })
      .catch(error => console.log(error));
  };

  loadNew = () => {
    this.loadFeed();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loading == true ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Loading...</Text>
          </View>
        ) : (
          <FlatList
            refreshing={this.state.refresh}
            onRefresh={this.loadNew}
            data={this.state.photo_feed}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1, backgroundColor: "#eee" }}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  width: "100%",
                  overflow: "hidden",
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
                    justifyContent: "space-between",
                    backgroundColor: "lightblue"
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

                <View>
                  <Image
                    source={{
                      uri: item.url
                    }}
                    style={{ resizeMode: "cover", width: "100%", height: 275 }}
                  />
                </View>

                <View style={{ padding: 5 }}>
                  <Text>{item.caption}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("Comments", {
                        userId: item.id
                      })
                    }
                  >
                    <Text
                      style={{
                        color: "blue",
                        marginTop: 10,
                        textAlign: "center",
                        backgroundColor: "#ABEBC6",
                        marginLeft: "30%",
                        marginRight: "30%"
                      }}
                    >
                      View Comments...
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    );
  }
}
