import React, { useState } from "react";
import { View, Text, Switch, Button, Image, TouchableOpacity, Modal, FlatList } from "react-native";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const MatchingPage = () => {
  console.log("Matching Page Loaded");

  const [selectedClothing, setSelectedClothing] = useState({
    top: null,
    bottom: null,
    shoes: null,
    accessories: null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [clothingImages, setClothingImages] = useState([]);

  // Toggle switch and open closet
  const handleToggle = async (category) => {
    setCurrentCategory(category);
    setModalVisible(true);

    // Fetch images from Firebase Storage under the user's closet
    const storage = getStorage();
    const userId = "exampleUserID"; // Replace with actual user ID 
    const storageRef = ref(storage, `users/${userId}/clothing`);
    
    try {
      const result = await listAll(storageRef);
      const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
      setClothingImages(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Select an image and close the modal
  const selectImage = (imageUrl) => {
    setSelectedClothing((prev) => ({ ...prev, [currentCategory]: imageUrl }));
    setModalVisible(false);
  };

  // Placeholder for random outfit generation (to be implemented later)
  const randomizeOutfit = () => {
    console.log("Randomizing Outfit...");
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#FAF5E4", paddingTop: 60 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>Select Outfit Details:</Text>

      {["top", "bottom", "shoes", "accessories"].map((category) => (
        <View key={category} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
          <Text style={{ fontSize: 18 }}>{`Select ${category.charAt(0).toUpperCase() + category.slice(1)}`}</Text>
          <Switch onValueChange={() => handleToggle(category)} value={!!selectedClothing[category]} />
        </View>
      ))}

      {/* Selected Images */}
      {Object.entries(selectedClothing).map(([category, imageUrl]) => (
        imageUrl && (
          <Image key={category} source={{ uri: imageUrl }} style={{ width: 100, height: 100, marginBottom: 10, alignSelf: "center" }} />
        )
      ))}

      {/* Buttons: Confirm and Randomize */}
      <View style={{ marginTop: 30, alignItems: "center" }}>
        <TouchableOpacity style={styles.button} onPress={() => console.log("Generate Outfit:", selectedClothing)}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={randomizeOutfit}>
          <Text style={styles.buttonText}>Randomize</Text>
        </TouchableOpacity>
      </View>

      {/* Image Selection Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Select {currentCategory}:</Text>
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
