import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { BGImage, Logo } from "../assets";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { setUser } from "../redux/slices/userSlice";
import { User } from "../models/main.model";
import { Nav } from "../models/types";

const LoginScreen = () => {
  //states
  const screenWidth = Math.round(Dimensions.get("window").width);
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [isEmailValid, setisEmailValid] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(true);
  const [alert, setalert] = useState<boolean>(false);
  const [alertMessage, setalertMessage] = useState<string>("");
  //declarations
  const dispatch = useDispatch();
  const { navigate } = useNavigation<Nav>(); //logic
  const handleEmailChange = (value: string) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const status = emailRegEx.test(value);
    setisEmailValid(status);
    setemail(value);
  };
  const handleLogin = async () => {
    if (isEmailValid && email !== "") {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCred) => {
          getDoc(doc(firestoreDB, "users", userCred?.user?.uid)).then(
            (docSnap) => {
              if (docSnap.exists()) {
                console.log(docSnap.data());
                dispatch(setUser(docSnap.data() as User));
              }
            }
          );
        })
        .catch((error) => {
          console.log(`error :${error.message}`);
          if (error.message.includes("wrong-password")) {
            setalert(true);
            setalertMessage("password mismatch");
          } else if (error.message.includes("user-not-found")) {
            setalert(true);
            setalertMessage("user not found");
          } else {
            setalert(true);
            setalertMessage("invalid email");
          }
          setTimeout(() => {
            setalert(false);
          }, 2000);
        });
    }
  };
  return (
    <View className="flex-1 items-center justify-start">
      <Image
        source={BGImage}
        resizeMode="cover"
        className="h-96"
        style={{ width: screenWidth }}
      />
      <KeyboardAvoidingView className="w-full h-full bg-white rounded-tl-[90px] -mt-44 flex items-center justify-start py-6 px-6 space-y-6">
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />
        <Text className="py-2 text-primaryText text-xl font-semibold">
          Welcome back!
        </Text>
        <View className="w-full flex items-center justify-center">
          {alert && (
            <Text className="text-base text-red-600">{alertMessage}</Text>
          )}

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
            onPress={handleLogin}
          >
            <Text className="py-2 text-white text-xl font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
          <View className="w-full flex-row items-center justify-center space-x-2">
            <Text className="text-base text-primaryText">
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigate("SignUpScreen", {})}>
              <Text className="text-base font-semibold text-primaryBold">
                Create Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
