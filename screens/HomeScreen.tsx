import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Chatroom, User } from "../models/main.model";
import { useNavigation } from "@react-navigation/native";
import { Nav } from "../models/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import { Logo } from "../assets";
import { Ionicons } from "@expo/vector-icons";
import MessageCard from "../components/MessageCard";
import ProfileIcon from "../components/ProfileIcon";
const HomeScreen = () => {
  //states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<Chatroom[]>([]);
  //declaration
  const user = useSelector((state: RootState) => state.user.user) as User;
  const { navigate } = useNavigation<Nav>();
  //logic
  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (querySnapchot) => {
      const chatRooms = querySnapchot.docs.map((doc) => doc.data());
      setChats(chatRooms as Chatroom[]);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);
  return (
    <View className="flex-1">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-2">
          <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
          <ProfileIcon
            dimensions="w-12 h-12"
            edit={false}
            press={() => navigate("ProfileScreen", {})}
            uri={user?.profilePic}
          />
        </View>
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            <View className="w-full flex-row items-center justify-between px-2">
              <Text className="text-primaryText text-base font-bold pb-2">
                Messages
              </Text>
              <TouchableOpacity onPress={() => navigate("AddToChatScreen", {})}>
                <Ionicons name="chatbox" size={28} color={"#555"} />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <>
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"#43C651"} />
                </View>
              </>
            ) : (
              <>
                {chats && chats?.length > 0 ? (
                  <>
                    {chats?.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
