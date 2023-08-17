import { View, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { Chatroom } from "../models/main.model";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "../models/types";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

interface messageCardProp {
  room: Chatroom;
}
const MessageCard: FC<messageCardProp> = ({ room }) => {
  const { navigate } = useNavigation<Nav>();
  return (
    <TouchableOpacity
      className="w-full flex-row items-center justify-center py-2"
      onPress={() => navigate("ChatScreen", { room: room })}
    >
      {/*image*/}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-primary p-1 justify-center">
        <FontAwesome5 name="users" size={24} color={"#555"} />
      </View>
      {/*content*/}
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          {room.chatname}
        </Text>
        <Text className="text-primaryText text-sm">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit...
        </Text>
      </View>
      {/*time*/}
      <Text className="text-primary px-4 text-base font-semibold"> 27 min</Text>
    </TouchableOpacity>
  );
};

export default MessageCard;
