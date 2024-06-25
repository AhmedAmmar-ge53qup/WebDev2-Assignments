import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5gpf1ZdOllJ3xdbE4SRX5vedq4i0L_Ks",
  authDomain: "react-query-mutations.firebaseapp.com",
  projectId: "react-query-mutations",
  storageBucket: "react-query-mutations.appspot.com",
  messagingSenderId: "925162184858",
  appId: "1:925162184858:web:ff9ecbebfe80b9e542bf23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  const usersCollection = collection(db, "users");

  switch (req.method) {
    case "POST":
      return res.status(500).json({ error: `POST not supported` });
    case "PUT":
      return res.status(500).json({ error: `PUT not supported` });
    case "DELETE":
      return res.status(500).json({ error: `DELETE not supported` });
    case "GET":
      if (!req.query.uuid) {
        const tmpUuid = uuidv4();
        try {
          await addDoc(usersCollection, { uuid: tmpUuid });
          return res.status(200).json({ uuid: tmpUuid });
        } catch (error) {
          console.error("Error adding document: ", error);
          return res.status(500).json({ error: `Generating UUID Failed: ${error.message}` });
        }
      } else {
        return res.status(400).json({ error: "UUID query parameter is not supported" });
      }
    default:
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
