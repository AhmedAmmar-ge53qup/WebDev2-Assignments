import {where, query, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

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

const ideasCollection = collection(db, "ideas");

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const { user } = req.query;
      const newIdea = { ...req.body, user };

      try {
        const docRef = await addDoc(ideasCollection, newIdea);
        const savedIdea = { id: docRef.id, ...newIdea };
        return res.status(200).json({ success: "Idea Added", idea: savedIdea });
      } catch (error) {
        console.error("Error adding document: ", error);
        return res.status(500).json({ error: `Posting Idea Failed: ${error.message}` });
      }

    case "DELETE":
      const { id } = req.body;

      try {
        // Query Firestore to find the document with your custom id attribute
        const q = query(ideasCollection, where("id", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Delete the document with Firestore-generated ID
          const docToDelete = querySnapshot.docs[0]; // Assuming there's only one match
          await deleteDoc(doc(ideasCollection, docToDelete.id));
          return res.status(200).json({ success: "Idea Deleted" });
        } else {
          return res.status(404).json({ error: "Idea not found" });
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
        return res.status(500).json({ error: `Deleting Idea Failed: ${error.message}` });
      }

    case "GET":
      try {
        const snapshot = await getDocs(ideasCollection);
        const ideas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json(ideas);
      } catch (error) {
        console.error("Error getting documents: ", error);
        return res.status(500).json({ error: `Fetching Ideas Failed: ${error.message}` });
      }

    default:
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}