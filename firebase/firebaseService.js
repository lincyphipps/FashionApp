import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

export const getMatchScore = (item1, item2) => {
  let score = 0;

  // Check formality
  if (item1.formality && item2.formality && item1.formality === item2.formality) {
    score += 1;
  }

  // Check for at least one shared weather type
  if (
    Array.isArray(item1.weather) &&
    Array.isArray(item2.weather) &&
    item1.weather.some(w => item2.weather.includes(w))
  ) {
    score += 1;
  }

  // Check if main colors match
  if (item1.colors?.[0] && item2.colors?.[0] && item1.colors[0] === item2.colors[0]) {
    score += 1;
  }

  return score;
};

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
    console.log("📦 MatchingPage fetched items:", clothingItems);
    return clothingItems;
  } catch (error) {
    console.error("Error fetching clothing:", error);
  }
};

export const fetchAllClothing = async (userId) => {
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

export const generateMatches = (items, selected, accessoryMode = false) => {
  const { top, bottom } = selected;
  const matches = [];

  const getMatchScore = (itemA, itemBImageUri) => {
    const itemB = items.find((i) => i.imageUrl === itemBImageUri);
    if (!itemA || !itemB) return 0;

    let score = 0;
    if (itemA.formality === itemB.formality) score++;
    if (itemA.colors?.some(color => itemB.colors?.includes(color))) score++;
    if (itemA.weather?.some(w => itemB.weather?.includes(w))) score++;

    return score;
  };

  if (accessoryMode && top && bottom) {
    for (const item of items) {
      if (item.category === "accessory") {
        const score = getMatchScore(item, top) + getMatchScore(item, bottom);
        if (score >= 2) matches.push({ item, score });
      }
    }
  } else if (top && !bottom) {
    for (const item of items) {
      if (item.category === "bottom") {
        const score = getMatchScore(item, top);
        if (score >= 2) matches.push({ item, score });
      }
    }
  } else if (bottom && !top) {
    for (const item of items) {
      if (item.category === "top") {
        const score = getMatchScore(item, bottom);
        if (score >= 2) matches.push({ item, score });
      }
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.map(m => m.item);
};