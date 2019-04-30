import React, { Component } from "react";
import { Permissions, ImagePicker } from "expo";
import {
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Flatlist,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";
import { f, auth, database, storage } from "../../Config/config";
import UserAuth from "../components/auth";

export default class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      imageId: this.uniqueId(),
      imageSelected: false,
      uploading: false,
      caption: "",
      progress: 0
    };
  }

  checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ camera: status });

    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ cameraRoll: statusRoll });
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

  findNewImage = async () => {
    this.checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      console.log("upload Image");
      // this.uploadImage(result.uri);
      this.setState({
        imageSelected: true,
        imageId: this.uniqueId(),
        uri: result.uri
      });
    } else {
      console.log("cancel");
      this.setState({
        imageSelected: false
      });
    }
  };

  uploadPublish = () => {
    if (this.state.uploading == false) {
      if (this.state.caption != "") {
        this.uploadImage(this.state.uri);
      } else {
        alert("Please enter a caption...");
      }
    } else {
      console.log("Ignore button tap as already updating");
    }
  };

  uploadImage = async uri => {
    var that = this;
    var userid = f.auth().currentUser.uid;
    var imageId = this.state.imageId;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({
      currentFileType: ext,
      uploading: true
    });

    const response = await fetch(uri);
    const blob = await response.blob();
    let FilePath = imageId + "." + that.state.currentFileType;

    const oReq = new XMLHttpRequest();
    oReq.open("GET", uri, true);
    oReq.responseType = "blob";
    oReq.onload = () => {
      const blob = oReq.response;
      //Call function to complete upload with the new blob to handle the uploadTask.
      this.completeUploadBlob(blob, FilePath);
    };
    oReq.send();
  };

  completeUploadBlob = (blob, FilePath) => {
    var that = this;
    var userid = f.auth().currentUser.uid;
    var imageId = this.state.imageId;

    var uploadTask = storage
      .ref("user/" + userid + "/img")
      .child(FilePath)
      .put(blob);

    uploadTask.on(
      "state_changed",
      function(snapshot) {
        var progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log("Upload is " + progress + "% complete");
        that.setState({
          progress: progress
        });
      },
      function(error) {
        console.log("error with upload - " + error);
      },
      function() {
        //complete
        that.setState({ progress: 100 });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.processUpload(downloadURL);
        });
      }
    );
  };

  processUpload = imageUrl => {
    // process here
    // build photo obj
    // author,caption,posted,url

    // set needed info
    let imageId = this.state.imageId;
    let userId = f.auth().currentUser.uid;
    let caption = this.state.caption;
    let dateTime = Date.now();
    let timestamp = Math.floor(dateTime / 1000);

    let photoObj = {
      author: userId,
      caption: caption,
      posted: timestamp,
      url: imageUrl
    };
    //  Update Database

    // add to main feed
    console.log("phtot obj ", photoObj);
    database.ref("/photos/" + imageId).set(photoObj);

    // set user photos object
    database.ref("/users/" + userId + "/photos/" + imageId).set(photoObj);

    alert("Image uploaded!!");

    this.setState({
      uploading: false,
      imageSelected: false,
      caption: "",
      uri: ""
    });
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
          <View style={{ flex: 1 }}>
            {/* check if a image is selected */}
            {this.state.imageSelected == true ? (
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
                  <Text>Upload</Text>
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{ marginTop: 5 }}>Caption</Text>
                  <TextInput
                    editable={true}
                    placeholder={"Enter your caption..."}
                    maxLength={150}
                    multiline={true}
                    numberOfLine={4}
                    onChangeText={text => this.setState({ caption: text })}
                    style={{
                      marginVertical: 10,
                      height: 100,
                      padding: 5,
                      borderColor: "grey",
                      borderWidth: 1,
                      borderRadius: 3,
                      backgroundColor: "white",
                      color: "black"
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => this.uploadPublish()}
                    style={{
                      alignSelf: "center",
                      width: 170,
                      marginHorizontal: "auto",
                      backgroundColor: "purple",
                      borderRadius: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 20
                    }}
                  >
                    <Text style={{ textAlign: "center", color: "white" }}>
                      Upload & Publish
                    </Text>
                  </TouchableOpacity>

                  {this.state.uploading == true ? (
                    <View style={{ marginTop: 10 }}>
                      <Text>{this.state.progress}%</Text>
                      {this.state.progress != 100 ? (
                        <ActivityIndicator size="small" color="blue" />
                      ) : (
                        <Text>Processing...</Text>
                      )}
                    </View>
                  ) : (
                    <View />
                  )}
                  <Image
                    source={{ uri: this.state.uri }}
                    style={{
                      marginTop: 10,
                      resizeMode: "cover",
                      width: "100%",
                      height: 275
                    }}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 28, paddingBottom: 15 }}>
                  Upload Page
                </Text>
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
            )}
          </View>
        ) : (
          <UserAuth message={"Please login to upload new content"} />
        )}
      </View>
    );
  }
}
