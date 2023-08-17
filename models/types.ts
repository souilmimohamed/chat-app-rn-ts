import { Chatroom } from "./main.model";

export type Nav = {
  navigate: (value: string, params: any) => void;
  replace: (value: string) => void;
  goBack(): () => void;
};

export type RootStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  HomeScreen: undefined;
  AddToChatScreen: undefined;
  ChatScreen: { room: Chatroom };
  ProfileScreen: undefined;
};
