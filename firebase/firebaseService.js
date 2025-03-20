import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

// 🔹 Function to add a clothing item
export const addClothingItem = async (userId, clothingData) => {
  try {
    await addDoc(collection(db, `users/${userId}/clothing`), clothingData);
    console.log("Clothing item added:", clothingData);
  } catch (error) {
    console.error("Error adding clothing:", error);
  }
};

// 🔹 Function to fetch clothing by category
export const fetchClothingByCategory = async (userId, category) => {
  const clothingRef = collection(db, `users/${userId}/clothing`);
  const q = query(clothingRef, where("category", "==", category));

  try {
    const querySnapshot = await getDocs(q);
    const clothingItems = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return clothingItems;
  } catch (error) {
    console.error("Error fetching clothing:", error);
  }
};

// 🔹 Function to delete a clothing item
export const deleteClothingItem = async (userId, clothingId) => {
  try {
    await deleteDoc(doc(db, `users/${userId}/clothing`, clothingId));
    console.log("Clothing item deleted:", clothingId);
  } catch (error) {
    console.error("Error deleting clothing:", error);
  }
};
