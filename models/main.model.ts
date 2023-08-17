export interface User {
  _id: string;
  fullName: string;
  profilePic: string;
  providerData: ProviderData;
}

export interface ProviderData {
  displayName: any;
  email: string;
  phoneNumber: any;
  photoURL: any;
  providerId: string;
  uid: string;
}

export interface Chatroom {
  _id: string;
  chatname: string;
  user: User;
}

export interface ChatMessage {
  _id: string;
  message: string;
  roomId: string;
  timeStamp: TimeStamp;
  user: User;
}
export interface TimeStamp {
  nanoseconds: number;
  seconds: number;
}

export interface Avatar {
  _id: string;
  title: string;
  image: Image;
}
export interface Image {
  asset: Asset;
}
export interface Asset {
  url: string;
}
