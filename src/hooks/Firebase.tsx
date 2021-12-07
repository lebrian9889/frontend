import { useEffect, useState } from 'react';
import { FirebaseApp } from "firebase/app";
import { initializeApp } from "firebase/app";

function useFirebase() {
  const [firebase, setFirebase] = useState<FirebaseApp>();

  useEffect(() => {
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    const firebaseConfig = {
      apiKey: "AIzaSyBejfpWKRcsw7ftEuwpnjKMaX2tXxTmXmc",
      authDomain: "aeternalism-1b189.firebaseapp.com",
      databaseURL: "https://aeternalism-1b189-default-rtdb.firebaseio.com",
      projectId: "aeternalism-1b189",
      storageBucket: "aeternalism-1b189.appspot.com",
      messagingSenderId: "912315508668",
      appId: "1:912315508668:web:301407e4385490e0e66db9",
      measurementId: "G-DPWE9R8G5G"
    };

    const app = initializeApp(firebaseConfig)

    setFirebase(app)
  }, [])

  return firebase;
}

export default useFirebase;