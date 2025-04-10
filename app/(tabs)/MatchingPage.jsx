import React, { useState, useEffect } from "react";
import { View, Text, Switch, Button, Image, TouchableOpacity, Modal, FlatList } from "react-native";
import { getStorage, ref, listAll, getDownloadURL } from "../../firebase/storage";
import { fetchAllClothing, generateMatches, fetchClothingByCategory } from "../../firebase/firebaseService"; 
import { getAuth } from 'firebase/auth';

const MatchingPage = () => {
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
    setModalVisible(true);
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    console.log("✅ MatchingPage userId:", userId);
    
    const firestoreCategory = category === "accessories" ? "accessory" : category.toLowerCase();
    setCurrentCategory(category);
    
    try {
      const firestoreCategory = category === "accessories" ? "accessory" : category;
      const items = await fetchClothingByCategory(userId, firestoreCategory);
      console.log("📦 Items fetched from Firestore:", items);

      const urls = items.map(item => item.imageUrl);
      console.log("🖼 Image URLs:", urls);
      
      console.log("📸 Setting modal visible with", urls.length, "images");
      setClothingImages(urls);
      setCurrentCategory(category);
      setModalVisible(true);  
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleConfirm = async () => {
    console.log("🚨 handleConfirm triggered!");
    console.log("🎯 selectedClothing BEFORE:", selectedClothing);

    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    
    const allClothing = await fetchAllClothing(userId);
    console.log("🧺 allClothing from Firestore:", allClothing);
    const updatedSelection = { ...selectedClothing };
    
    // filter clothes by category
    const tops = allClothing.filter(item => item.category === 'top');
    const bottoms = allClothing.filter(item => item.category === 'bottom');
    const accessories = allClothing.filter(item => item.category === 'accessory');

      // CASE 1: Only top selected
    if (selectedClothing.top && !selectedClothing.bottom) {
      console.log("📌 CASE 1: Top selected, finding bottom...");
      const match = generateMatches(allClothing, selectedClothing, false)?.[0];
      console.log("🎯 Found bottom match:", match);
      if (match?.category === "bottom") {
        updatedSelection.bottom = match.imageUrl;
      }
      console.log("🎯 Found match:", match);
    }

    // CASE 2: Only bottom selected
    if (!selectedClothing.top && selectedClothing.bottom) {
      const match = generateMatches(allClothing, selectedClothing, false)?.[0];
      if (match?.category === "top") {
        updatedSelection.top = match.imageUrl;
      }
    }

    // CASE 3: Top + Bottom selected, accessory toggle ON
    if (selectedClothing.top && selectedClothing.bottom && accessorySwitchOn && !selectedClothing.accessories) {
      const match = generateMatches(allClothing, selectedClothing, true)?.[0];
      if (match?.category === "accessory") {
        updatedSelection.accessories = match.imageUrl;
      }
    }

    // CASE 4: Accessory + Top or Bottom selected, fill in missing top/bottom
    if (selectedClothing.accessories && (!selectedClothing.top || !selectedClothing.bottom)) {
      const match = generateMatches(allClothing, selectedClothing, false)?.[0];
      if (match?.category === "top" && !selectedClothing.top) {
        updatedSelection.top = match.imageUrl;
      }
      if (match?.category === "bottom" && !selectedClothing.bottom) {
        updatedSelection.bottom = match.imageUrl;
      }
    }
    
    setSelectedClothing(updatedSelection);

    const newMatchedResults = [
      {
        top: updatedSelection.top,
        bottom: updatedSelection.bottom,
        accessories: accessorySwitchOn ? updatedSelection.accessories : null,
      }
    ];
    console.log("🧩 Final updated selection:", updatedSelection);
    setMatchedResults(newMatchedResults);
    console.log("✅ Matched results:", newMatchedResults); // ✅ Correct: logs what was just set
    //setOutfitModalVisible(true);
  };  

  const selectImage = (imageUrl) => {
    setSelectedClothing((prev) => ({ ...prev, [currentCategory]: imageUrl }));
    setModalVisible(false);
  };

  const randomizeOutfit = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const allClothing = await fetchAllClothing(userId);
  
    const getRandomItem = (category) => {
      const items = allClothing.filter(item => item.category === category);
      return items.length > 0 ? items[Math.floor(Math.random() * items.length)] : null;
    };
  
    const randomTop = getRandomItem("top");
    const randomBottom = getRandomItem("bottom");
    const randomAccessory = accessorySwitchOn ? getRandomItem("accessory") : null;
  
    const randomSelection = {
      top: randomTop?.imageUrl || null,
      bottom: randomBottom?.imageUrl || null,
      accessories: randomAccessory?.imageUrl || null,
    };
  
    setSelectedClothing(randomSelection);
    setMatchedResults([randomSelection]);
    //setOutfitModalVisible(true);
  };  

  // Helper: is accessory toggle allowed
  const canToggleAccessories = selectedClothing.top && selectedClothing.bottom;
  
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#FAF5E4", paddingTop: 60 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        Select Outfit Details:
      </Text>

      {["top", "bottom", "accessories"].map((category) => {
      const isSelected = selectedClothing[category] !== null;
      const selectedCount = Object.values(selectedClothing).filter(Boolean).length;
      const canSelectMore = isSelected || selectedCount < 2;

      return (
        <View key={category} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
          <Text style={{ fontSize: 18 }}>
            {`Select ${category.charAt(0).toUpperCase() + category.slice(1)}`}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (isSelected) {
                setSelectedClothing(prev => ({ ...prev, [category]: null }));
                if (category === "accessories") setAccessorySwitchOn(false);
              } else if (canSelectMore) {
                handleToggle(category);
                if (category === "accessories") setAccessorySwitchOn(true);
              }
            }}
            disabled={!canSelectMore && !isSelected}
          >
            <Text
              style={{
                color: isSelected ? "red" : "blue",
                fontWeight: "bold",
                opacity: canSelectMore || isSelected ? 1 : 0.5,
              }}
            >
              {isSelected ? "Cancel" : "Choose"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    })}

      {/* Selected Images */}
      {Object.entries(selectedClothing).map(([category, imageUrl]) => {
        const matched = matchedResults[0]?.[category];
        const isUserSelected = imageUrl && imageUrl !== matched;

        return isUserSelected ? (
          <Image
            key={category}
            source={{ uri: imageUrl }}
            style={{ width: 100, height: 100, marginBottom: 10, alignSelf: "center" }}
          />
        ) : null;
      })}

      {matchedResults.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Recommended Match:</Text>
          {matchedResults.map((item, index) => (
            <View key={index} style={{ alignItems: "center", marginBottom: 20 }}>
              {item.top && (
                <>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Top Match:</Text>
                  <Image source={{ uri: item.top }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                </>
              )}
              {item.bottom && (
                <>
                  <Text style={{ fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>Bottom Match:</Text>
                  <Image source={{ uri: item.bottom }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                </>
              )}
              {item.accessories && (
                <>
                  <Text style={{ fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>Accessory Match:</Text>
                  <Image source={{ uri: item.accessories }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                </>
              )}
            </View>
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
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 30 }}>
            Select {currentCategory}:
          </Text>
          <Text>Image count: {clothingImages.length}</Text>
          <FlatList
            data={clothingImages}
            extraData={clothingImages}
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

      {/* <Modal visible={outfitModalVisible} animationType="slide" transparent={false}>
        <View style={{ flex: 1, padding: 30, backgroundColor: "#FFF" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 40, marginBottom: 20, textAlign: "center" }}>
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
      </Modal> */}

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
