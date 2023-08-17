import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { BGImage, Logo } from "../assets";
import { useNavigation } from "@react-navigation/native";
import { avatars } from "../utils/support";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { Nav } from "../models/types";
import { Avatar } from "../models/main.model";
import ProfileIcon from "../components/ProfileIcon";

const SignUpScreen = () => {
  //states
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [avatarMenu, setAvatarMenu] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(avatars[0]?.image.asset.url);
  const [isEmailValid, setisEmailValid] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(true);
  //declarations
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);
  const { navigate } = useNavigation<Nav>();
  //logic
  const handleAvatar = (item: Avatar) => {
    setAvatar(item?.image.asset.url);
    setAvatarMenu(false);
  };
  const handleSigunUp = async () => {
    if (isEmailValid && email !== "") {
      console.log({ fullname, email, password });
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred?.user.uid,
            fullName: fullname,
            profilePic: avatar,
            providerData: userCred?.user?.providerData[0],
          };
          setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(
            () => {
              navigate("LoginScreen", {});
            }
          );
        }
      );
    }
  };
  const handleEmailChange = (value: string) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const status = emailRegEx.test(value);
    setisEmailValid(status);
    setemail(value);
  };
  return (
    <KeyboardAvoidingView className="flex-1 items-center justify-start">
      <Image
        source={BGImage}
        resizeMode="cover"
        className="h-96"
        style={{ width: screenWidth }}
      />

      {avatarMenu && (
        <>
          <View
            className="absolute inset-0 z-10"
            style={{ width: screenWidth, height: screenHeight }}
          >
            <ScrollView>
              <BlurView
                className="w-full h-full px-4 py-16 flex-row flex-wrap items-center justify-center"
                tint="light"
                intensity={40}
              >
                {avatars?.map((item, i) => (
                  <TouchableOpacity
                    onPress={() => handleAvatar(item)}
                    key={i}
                    className="w-20 m-3 h-20 rounded-full border-2 border-primary relative"
                  >
                    <Image
                      source={{ uri: item?.image.asset.url }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </BlurView>
            </ScrollView>
          </View>
        </>
      )}

      <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 flex items-center justify-start py-6 px-6 space-y-6">
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />
        <Text className=" text-primaryText text-xl font-semibold">
          Join with us!
        </Text>
        <View className="w-full flex items-center justify-center relative -my-4">
          <ProfileIcon
            dimensions="w-20 h-20"
            edit={true}
            press={() => setAvatarMenu(true)}
            uri={avatar}
          />
        </View>
        <View className="w-full flex items-center justify-center">
          <View
            className={`border rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2 border-gray-200`}
          >
            <MaterialIcons name="person" size={24} color={"#6C6D83"} />
            <TextInput
              className="flex-1 text-base text-primaryText font-semibold -mt-1"
              placeholder="Full Name"
              value={fullname}
              onChangeText={(value) => setFullname(value)}
            />
          </View>
          <View
            className={`border rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2 ${
              !isEmailValid && email.length > 0
                ? "border-red-500"
                : "border-gray-200"
            }`}
          >
            <MaterialIcons name="email" size={24} color={"#6C6D83"} />
            <TextInput
              className="flex-1 text-base text-primaryText font-semibold -mt-1"
              placeholder="email"
              value={email}
              onChangeText={handleEmailChange}
            />
          </View>
          <View
            className={`border rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2 border-gray-200`}
          >
            <MaterialIcons name="lock" size={24} color={"#6C6D83"} />
            <TextInput
              className="flex-1 text-base text-primaryText font-semibold -mt-1"
              placeholder="Password"
              value={password}
              onChangeText={(value) => setpassword(value)}
              secureTextEntry={showPass}
            />

            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Entypo
                name={`${showPass ? "eye" : "eye-with-line"}`}
                size={24}
                color={"#6c6d38"}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="w-full px-4 py-2 rounded-xl bg-primary my-3 flex items-center justify-center"
            onPress={handleSigunUp}
          >
            <Text className="py-2 text-white text-xl font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
          <View className="w-full flex-row items-center justify-center space-x-2">
            <Text className="text-base text-primaryText">Have an account</Text>
            <TouchableOpacity onPress={() => navigate("LoginScreen", {})}>
              <Text className="text-base font-semibold text-primaryBold">
                Login Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
