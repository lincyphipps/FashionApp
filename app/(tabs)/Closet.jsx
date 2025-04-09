import React, { useState, useEffect} from "react";
import { View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity, Modal, StyleSheet, Image } from "react-native";
import { addClothingItem, fetchClothingByCategory, deleteClothingItem } from "../../firebase/firebaseService";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL } from "firebase/storage";
//import { uploadClothingImage } from '../../firebase/storage';

const Closet = () => {
    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Get logged-in user ID

    const tabs = ['Tops', 'Bottoms', 'Accessories'];
    const categoryKeys = ['top', 'bottom', 'accessory'];
    const [selectedTab, setSelectedTab] = useState(0);

    const [category, setCategory] = useState("");
    const [colors, setColors] = useState("");
    const [formality, setFormality] = useState("");
    const [weather, setWeather] = useState("");
    const [clothing, setClothing] = useState([]); // Stores added clothing items
    const [modalVisible, setModalVisible] = useState(false); // Controls modal visibility
    const [image, setImage] = useState(null);

    // 🔹 Fetch Clothing when screen loads or category changes
    useEffect(() => {
        const loadClothing = async () => {
            if (!userId) return;
          
            const selectedCategory = categoryKeys[selectedTab];
            let items = [];

            items = await fetchClothingByCategory(userId, selectedCategory);
            setClothing(items || []);
          };          
        loadClothing();
    }, [selectedTab]); // Refetch when category changes

    // 🔹 Add Clothing Item
    const handleAddClothing = async () => {         
        if (!category || !colors || !formality || !weather || !image) {
          Alert.alert("Error", "Please fill out all fields.");
          return;
        }
      
        const tempId = Date.now().toString(); // generate a unique ID for image filename
        console.log("🆔 Generated temp ID:", tempId);
      
        const imageUrl = image;
        console.log("📸 Uploading image URL:", imageUrl);
        if (!imageUrl) {
          Alert.alert("Error", "Failed to upload image.");
          return;
        }
        console.log("✅ Proceeding to add clothing item to Firestore");
      
        const clothingData = {
          category,
          colors: colors.split(",").map(c => c.trim()),
          formality,
          weather: weather.split(",").map(w => w.trim()),
          imageUrl, // ✅ From Firebase
        };
      
        await addClothingItem(userId, clothingData);
        Alert.alert("Success", "Clothing item added!");
        setModalVisible(false);
        fetchUpdatedClothing();
      
        // Reset fields (optional)
        setCategory('');
        setColors('');
        setWeather('');
        setFormality('');
        setImage(null);
      };      

    const handlePickImage = async () => {
        console.log("📸 handlePickImage called");
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('We need access to your photo library!');
          return;
        }
      
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        
            console.log("🧾 Picker result:", result);
        
            if (!result.canceled && result.assets?.length > 0) {
              const uri = result.assets[0].uri;
              console.log("✅ Image URI:", uri);
              setImage(uri);
            } else {
              console.log("🚫 Picker canceled");
            }
          } catch (error) {
            console.error("❌ Picker error:", error);
          }
      };      

    // 🔹 Fetch updated clothing after adding new item
    const fetchUpdatedClothing = async () => {
        const items = await fetchClothingByCategory(userId, category);
        setClothing(items);
    };

    // 🔹 Delete Clothing
    const handleDeleteClothing = async (clothingId) => {
        await deleteClothingItem(userId, clothingId);
        console.log("Clothing item deleted:", clothingId);
      
        const selectedCategory = categoryKeys[selectedTab];
        const updated = await fetchClothingByCategory(userId, selectedCategory);
        setClothing(updated);
      };      

    // Render clothing items (use imageUrl from Firebase)
    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <TouchableOpacity onPress={() => handleDeleteClothing(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

    const closeModal = () => {
        setImage(null);
        setModalVisible(false);
      };

    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.topTitleContainer}>
                <Text style={styles.topTitleText}>My Closet</Text>
            </View>

            {/* Tab Navigation */}
            <View style={styles.tabBar}>
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.tabItem, selectedTab === index && styles.activeTab]}
                        onPress={() => setSelectedTab(index)}
                    >
                        <Text style={[styles.tabText, selectedTab === index && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Clothing List */}
            {Array.isArray(clothing) && clothing.length > 0 ? (
                <FlatList
                    data={clothing}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.grid}
                />
            ) : (
                <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" }}>
                    No clothing found in this category.
                </Text>
            )}

            {/* Floating Add Button */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.plusButton}>
                <Ionicons name="add-circle-outline" size={50} color="black" />
            </TouchableOpacity>

            {/* Modal for Adding Clothing */}
            <Modal visible={modalVisible} animationType="slide">
            <View style={{ flex: 1, padding: 60, paddingLeft: 60, position: "relative" }}>
                    <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 10 }}>Add Clothing</Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Clothing Type: Top, Bottom, Accessory</Text>
                    <TextInput
                        style={[styles.input, { color: '#6d5e9c' }]}
                        placeholder="Clothing Type"
                        placeholderTextColor="#aaa"
                        value={category}
                        onChangeText={setCategory}
                    />
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Colors</Text>
                    <TextInput
                        style={[styles.input, { color: '#6d5e9c' }]}
                        placeholder="Colors (comma-separated)"
                        placeholderTextColor="#aaa"
                        value={colors}
                        onChangeText={setColors}
                    />                    
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Weather: Hot, Rainy, Normal, Cold</Text>
                    <TextInput
                        style={[styles.input, { color: '#6d5e9c' }]}
                        placeholder="Weather (comma-separated)"
                        placeholderTextColor="#aaa"
                        value={weather}
                        onChangeText={setWeather}
                    />
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Formality: Casual or Formal</Text>
                    <TextInput
                        style={[styles.input, { color: '#6d5e9c' }]}
                        placeholder="Formality (comma-separated)"
                        placeholderTextColor="#aaa"
                        value={formality}
                        onChangeText={setFormality}
                    />

                    <Button title="Choose Image from Camera Roll" onPress={handlePickImage} />
                    {image && (
                    <Image
                        source={{ uri: image }}
                        style={{ width: 150, height: 150, marginTop: 10, borderRadius: 10 }}
                    />
                    )}

                    <Button title="Add Item" onPress={handleAddClothing} />
                    <Button title="Close" onPress={closeModal} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fffcee' },
    topTitleContainer: { justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
    topTitleText: { fontSize: 40, fontWeight: 'bold', color: 'black' },
    tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
    tabItem: { paddingVertical: 8, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: 'gray' },
    tabText: { fontSize: 20, color: 'gray' },
    activeTab: { borderBottomWidth: 2, borderBottomColor: 'black' },
    activeTabText: { color: 'black', fontWeight: 'bold' },
    grid: { padding: 10, alignItems: 'center' },
    imageContainer: { margin: 10, borderRadius: 10, width: 150, height: 150, justifyContent: 'center', alignItems: 'center' },
    image: { width: 150, height: 150, borderRadius: 10 },
    plusButton: { position: "absolute", top: 30, right: 20, backgroundColor: '#E8DEFF', borderRadius: 50, padding: 10, elevation: 5 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 5, width: "80%" },
    modal: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white", padding: 20 }
});

export default Closet;
