import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from "firebase/app";

const storage = getStorage();
/*
export const uploadClothingImage = async (uri, userId, itemId) => {
  try {
    console.log("📸 Uploading image:", uri);

    // 🔥 Use fetch to convert image URI into a Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage(getApp());
    const imageRef = ref(storage, `users/${userId}/clothing/${itemId}.jpg`);
    await uploadBytes(imageRef, blob);
    console.log("🗂 Firebase path:", imageRef.fullPath);

    const downloadURL = await getDownloadURL(imageRef);
    console.log("✅ Uploaded Image URL:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("❌ Final Upload Error:", error);
    return null;
  }
};*/
