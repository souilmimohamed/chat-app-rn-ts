import { View, Text } from "react-native";
import React, { FC } from "react";
import { ChatMessage, User } from "../models/main.model";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface chatMessageProp {
  message: ChatMessage;
}

const ChatMessageBubble: FC<chatMessageProp> = ({ message }) => {
  const user = useSelector((state: RootState) => state.user.user) as User;
  const isUserMessage =
    message.user.providerData.email === user.providerData.email;
  return (
    <View className="m-1">
      <View
        style={
          isUserMessage
            ? { alignSelf: "flex-end" }
            : { alignSelf: "flex-start" }
        }
        className={`px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-primary w-auto relative ${
          isUserMessage ? "bg-primary" : "bg-gray-200"
        }`}
      >
        <Text
          className={`text-base font-semibold ${
            isUserMessage ? "text-white" : "text-black"
          }`}
        >
          {message?.message}
        </Text>
      </View>
      <View
        style={
          isUserMessage
            ? { alignSelf: "flex-end" }
            : { alignSelf: "flex-start" }
        }
      >
        {message?.timeStamp?.seconds && (
          <Text className="text-[12px] text-black font-semibold">
            {new Date(message?.timeStamp?.seconds * 1000).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }
            )}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ChatMessageBubble;
