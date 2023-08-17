import {
  View,
  Text,
  TextInput,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { ChatMessage, User } from "../models/main.model";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Nav, RootStackParamList } from "../models/types";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import ChatMessageBubble from "../components/ChatMessageBubble";

type Props = NativeStackScreenProps<RootStackParamList, "ChatScreen">;
const ChatScreen = ({ route }: Props) => {
  //states
  const [isLoading, setIsLoading] = useState(true);
  const textInputRef = useRef<TextInput>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  //declarations
  const { room } = route.params;
  const user = useSelector((state: RootState) => state.user.user) as User;
  const { navigate, goBack } = useNavigation<Nav>();
  //logic
  const handleKeybordOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };
  const sendMessage = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };
    setMessage("");
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {})
      .catch((err) => {
        alert(`Error :${err.message}`);
      });
  };
  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnapShot) => {
      const upMsg = querySnapShot.docs.map((doc) =>
        doc.data()
      ) as ChatMessage[];
      setMessages(upMsg);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);
  return (
    <View className="flex-1 ">
      <View className="w-full bg-primary px-4 py-6 flex-[0.2]">
        <View className="flex-row items-center justify-between w-full -px-4 py-12">
          <TouchableOpacity onPress={() => goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>
          <View className="flex-row items-center justify-center space-x-3">
            <View className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <FontAwesome5 name="users" size={24} color={"#fbfbfb"} />
            </View>
            <View>
              <Text className="text-gray-50 text-base font-semibold capitalize">
                {room.chatname.length > 16
                  ? `${room.chatname.slice(0, 16)}..`
                  : room.chatname}
              </Text>
              <Text className="text-gray-100 text-sm font-semibold capitalize">
                online
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-center space-x-3">
            <TouchableOpacity>
              <FontAwesome5 name="video" size={24} color={"#fbfbfb"} />
            </TouchableOpacity>

            <TouchableOpacity>
              <FontAwesome5 name="phone" size={24} color={"#fbfbfb"} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={24} color={"#fbfbfb"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <ScrollView>
              {isLoading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#43C651"} />
                  </View>
                </>
              ) : (
                <>
                  {messages?.map((msg, i) => (
                    <ChatMessageBubble message={msg} key={i} />
                  ))}
                </>
              )}
            </ScrollView>
            <View className="w-full flex-row items-center justify-center px-8">
              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-center">
                <TouchableOpacity onPress={handleKeybordOpen}>
                  <Entypo name="emoji-happy" size={24} color={"#555"} />
                </TouchableOpacity>
                <TextInput
                  className="flex-1 text-base text-primaryText font-semibold"
                  placeholder="Type here ..."
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(value) => setMessage(value)}
                  ref={textInputRef}
                />

                <TouchableOpacity>
                  <Entypo name="mic" size={24} color={"#43C651"} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="pl-4" onPress={sendMessage}>
                <FontAwesome name="send" size={24} color={"#555"} />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
