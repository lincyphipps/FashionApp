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

const fetchAllClothing = async (userId) => {
  const categories = ["top", "bottom", "accessory"];
  const allItems = [];

  for (const category of categories) {
    const items = await fetchClothingByCategory(userId, category);
    allItems.push(...items);
  }

  return allItems;
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

// 🔹 Function to get matching outfits
export const getMatchingOutfits = async (userId, preferences = {}) => {
  try {
    const clothingRef = collection(db, `users/${userId}/clothing`);
    const querySnapshot = await getDocs(clothingRef);

    const clothingItems = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Filter/match logic based on preferences (e.g., weather, occasion, color harmony)
    const matches = generateMatches(clothingItems, selectedClothing, isAccessoryMode);

    return matches;

  } catch (error) {
    console.error("Error fetching matching outfits:", error);
    return [];
  }
};

const generateMatches = (items, selected, accessoryMode = false) => {
  const { top, bottom } = selected;
  const matches = [];

  if (accessoryMode && top && bottom) {
    for (const item of items) {
      if (item.category === "accessory") {
        const score = getMatchScore(item, top) + getMatchScore(item, bottom);
        if (score >= 2) {
          matches.push({ item, score });
        }
      }
    }
  } else if (top && !bottom) {
    for (const item of items) {
      if (item.category === "bottom") {
        const score = getMatchScore(item, top);
        if (score >= 2) {
          matches.push({ item, score });
        }
      }
    }
  } else if (bottom && !top) {
    for (const item of items) {
      if (item.category === "top") {
        const score = getMatchScore(item, bottom);
        if (score >= 2) {
          matches.push({ item, score });
        }
      }
    }
  }

  // Sort by best score
  matches.sort((a, b) => b.score - a.score);

  // Return just the clothing items
  return matches.map(match => match.item);
};