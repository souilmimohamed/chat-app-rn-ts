import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useLayoutEffect } from "react";
import { Logo } from "../assets";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { User } from "../models/main.model";
import { Nav } from "../models/types";

const SplashScreen = () => {
  const { navigate, replace } = useNavigation<Nav>(); //logic
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    checkLogUser();
  }, []);
  const checkLogUser = async () => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred?.uid) {
        getDoc(doc(firestoreDB, "users", userCred?.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              dispatch(setUser(docSnap.data() as User));
            }
          })
          .then(() => {
            setTimeout(() => {
              replace("HomeScreen");
            }, 2000);
          });
      } else {
        replace("LoginScreen");
      }
    });
  };
  return (
    <View className="flex-1 items-center justify-center space-y-24">
      <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
      <ActivityIndicator size={"large"} color={"#43C651"} />
    </View>
  );
};

export default SplashScreen;
