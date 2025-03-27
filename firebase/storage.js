import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebaseConfig";

const storage = getStorage(app);

// function to upload image to Firebase Storage
// params: uri: image location, itemId: clothing item id
export const uploadClothingImage = async (uri, itemId) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `clothing/${itemId}.jpg`);
  
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      console.log("Uploaded Image URL:", downloadURL);
  
      return downloadURL;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };