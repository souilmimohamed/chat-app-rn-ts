import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { User } from "../models/main.model";
import { RootState } from "../redux/store";
import { Nav } from "../models/types";
import ProfileIcon from "../components/ProfileIcon";
const AddToChatScreen = () => {
  //states
  const [addChat, setAddChat] = useState<string>("");
  //declarations
  const user = useSelector((state: RootState) => state.user.user) as User;
  const { navigate, goBack } = useNavigation<Nav>();
  //logic
  const createNewChat = async () => {
    let id = `${Date.now()}`;
    const _doc = {
      _id: id,
      user: user,
      chatname: addChat,
    };
    if (addChat !== "") {
      setDoc(doc(firestoreDB, "chats", id), _doc)
        .then(() => {
          setAddChat("");
          navigate("HomeScreen", {});
        })
        .catch((err) => {
          alert(`Error : ${err.message}`);
        });
    }
  };
  return (
    <View className="flex-1 ">
      <View className="w-full bg-primary px-4 py-6 flex-[0.25]">
        <View className="flex-row items-center justify-between w-full px-4 py-12">
          <TouchableOpacity onPress={() => goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>
          <ProfileIcon
            dimensions="h-12 w-12"
            press={() => navigate("ProfileScreen", {})}
            uri={user?.profilePic}
            edit={false}
          />
        </View>
      </View>
      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <View className="w-full px-4 py-4">
          <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            <Ionicons name="chatbubbles" size={24} color={"#777"} />
            <TextInput
              className="flex-1 text-lg text-primaryText -mt-1 h-12 w-full"
              placeholder="create a chat"
              placeholderTextColor={"#999"}
              value={addChat}
              onChangeText={(value) => setAddChat(value)}
            />

            <TouchableOpacity onPress={createNewChat}>
              <FontAwesome name="send" size={24} color={"#777"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddToChatScreen;
