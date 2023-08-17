import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { FC } from "react";
import { MaterialIcons } from "@expo/vector-icons";
interface profileIconProps {
  uri: string;
  dimensions: string;
  press: () => void;
  edit: boolean;
}
const ProfileIcon: FC<profileIconProps> = ({
  uri,
  dimensions,
  press,
  edit,
}) => {
  return (
    <TouchableOpacity
      className={`${dimensions} rounded-full border border-primary flex items-center justify-center`}
      onPress={press}
    >
      <Image
        source={{ uri: uri }}
        className="w-full h-full"
        resizeMode="contain"
      />
      {edit && (
        <View className="w-6 h-6 bg-primary rounded-full absolute top-0 right-0 items-center justify-center">
          <MaterialIcons name="edit" size={18} color={"#fff"} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProfileIcon;
