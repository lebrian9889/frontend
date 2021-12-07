import { FirebaseApp } from "firebase/app";
import { Firestore } from "firebase/firestore/lite";
import { FirebaseStorage } from "firebase/storage";
import { Analytics } from "firebase/analytics";

interface Firebase {
  fireApp: FirebaseApp;
  fireStore: Firestore;
  fireStorage: FirebaseStorage;
  analytics: Analytics;
}

export default Firebase;
