import React, { useState } from "react";
import { View, Text, Switch, Button, Image, TouchableOpacity, Modal, FlatList } from "react-native";
import { getStorage, ref, listAll, getDownloadURL } from "../../firebase/storage";
import { fetchAllClothing, generateMatches } from "../../firebase/firebaseService"; 
import { getAuth } from 'firebase/auth';

const MatchingPage = () => {
  console.log("Matching Page Loaded");

  const [selectedClothing, setSelectedClothing] = useState({
    top: null,
    bottom: null,
    accessories: null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [outfitModalVisible, setOutfitModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [clothingImages, setClothingImages] = useState([]);
  const [matchedResults, setMatchedResults] = useState([]);
  const [accessorySwitchOn, setAccessorySwitchOn] = useState(false);

  const handleToggle = async (category) => {
    setCurrentCategory(category);
    setModalVisible(true);

    const auth = getAuth();
    const user = auth.currentUser;
    console.log("🔥 Full current user:", JSON.stringify(user, null, 2));    

    const storage = getStorage();
    
    const cleanUserId = auth.currentUser?.uid.trim();
    console.log("✅ Clean user ID:", cleanUserId);
    const storageRef = ref(storage, `users/${cleanUserId}/clothing`);
    console.log("🗂 Firebase path:", `users/${cleanUserId}/clothing/${itemId}.jpg`);

    try {
      const firestoreCategory = category === "accessories" ? "accessory" : category;

      const items = await fetchClothingByCategory(userId, firestoreCategory);
      const urls = items.map(item => item.imageUrl); // only grab image URLs
      setClothingImages(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleConfirm = async () => {
    const auth = getAuth();
    const cleanUserId = auth.currentUser?.uid;
    const allClothing = await fetchAllClothing(userId);
  
    const matches = generateMatches(allClothing, selectedClothing, accessorySwitchOn);
  
    setMatchedResults(matches); // display in UI
    setOutfitModalVisible(true);
  };  

  const selectImage = (imageUrl) => {
    setSelectedClothing((prev) => ({ ...prev, [currentCategory]: imageUrl }));
    setModalVisible(false);
  };

  const randomizeOutfit = () => {
    console.log("Randomizing Outfit...");
  };

  // Helper: is accessory toggle allowed
  const canToggleAccessories = selectedClothing.top && selectedClothing.bottom;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#FAF5E4", paddingTop: 60 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        Select Outfit Details:
      </Text>

      {["top", "bottom", "accessories"].map((category) => (
        <View key={category} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
          <Text style={{ fontSize: 18 }}>
            {`Select ${category.charAt(0).toUpperCase() + category.slice(1)}`}
          </Text>

          {/* Disable accessories switch if top/bottom not selected */}
          <Switch
            onValueChange={(value) => {
              if (category === "accessories") {
                setAccessorySwitchOn(value);
                if (!value) {
                  setSelectedClothing(prev => ({ ...prev, accessories: null }));
                }
              }
              handleToggle(category);
            }}
            value={category === "accessories" ? accessorySwitchOn : !!selectedClothing[category]}
            disabled={category === "accessories" && !canToggleAccessories}
          />
        </View>
      ))}

      {/* Selected Images */}
      {Object.entries(selectedClothing).map(
        ([category, imageUrl]) =>
          imageUrl && (
            <Image
              key={category}
              source={{ uri: imageUrl }}
              style={{ width: 100, height: 100, marginBottom: 10, alignSelf: "center" }}
            />
          )
      )}

      {matchedResults.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Recommended Match:</Text>
          {matchedResults.map((item, index) => (
            <Image
              key={index}
              source={{ uri: item.imageUrl }} // or whatever field holds the image
              style={{ width: 100, height: 100, marginBottom: 10 }}
            />
          ))}
        </View>
      )}

      {/* Buttons */}
      <View style={{ marginTop: 30, alignItems: "center" }}>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={randomizeOutfit}>
          <Text style={styles.buttonText}>Randomize</Text>
        </TouchableOpacity>
      </View>

      {/* Image Selection Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
            Select {currentCategory}:
          </Text>
          <FlatList
            data={clothingImages}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectImage(item)} style={{ margin: 5 }}>
                <Image source={{ uri: item }} style={{ width: 100, height: 100, borderRadius: 10 }} />
              </TouchableOpacity>
            )}
          />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <Modal visible={outfitModalVisible} animationType="slide" transparent={false}>
        <View style={{ flex: 1, padding: 30, backgroundColor: "#FFF" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
            Your Matched Outfit
          </Text>
          
          {selectedClothing.top && (
            <Image source={{ uri: selectedClothing.top }} style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 15 }} />
          )}
          {selectedClothing.bottom && (
            <Image source={{ uri: selectedClothing.bottom }} style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 15 }} />
          )}
          {accessorySwitchOn && selectedClothing.accessories && (
            <Image source={{ uri: selectedClothing.accessories }} style={{ width: 120, height: 120, alignSelf: "center", marginBottom: 15 }} />
          )}

          <Button title="Close" onPress={() => setOutfitModalVisible(false)} />
        </View>
      </Modal>

    </View>
  );
};

const styles = {
  button: {
    backgroundColor: "#6F4EAD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: 200,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
};

export default MatchingPage;
