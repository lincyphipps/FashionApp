import { db } from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const auth = getAuth();

// function to add clothing items
export const addClothingItem = async () => {
    const user = auth.currentUser;
    if (!user) {
        console.log("No user is signed in.");
        return;
    }

    const docRef = doc(db, "users", user.uid);
    try {
        await updateDoc(userDocRef, {
            // store item with a unique timestamp key
            [`clothing.${Date.now()}`]: item, 
        });
        console.log("Clothing item added:", item);
    } catch (error) {
        console.error("Error adding clothing item:", error);
    }
};

// retrieve all clothing items for the user
export const getUserClothing = async () => {
    const user = auth.currentUser;
    if (!user) return null;
    
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);
    
    if (!userSnapshot.exists()) return null;
    
    return userSnapshot.data().clothing || {};
};

    