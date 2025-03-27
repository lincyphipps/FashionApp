import React, { useState, useEffect} from "react";
import { View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity, Modal, StyleSheet, Image} from "react-native";
import { addClothingItem, fetchClothingByCategory, deleteClothingItem } from "../../firebase/firebaseService";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";


const Closet = () => {

    const newClothingItem = {
        category: "top",
        colors: ["blue"],
        formality: "casual",
        weather: ["sunny"],
        imageUrl: "../assets/images/navy-sport-coat.png",
      };
      
    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Get logged-in user ID

    const tabs = ['Recents', 'Tops', 'Bottoms', 'Accessories'];
    const [selectedTab, setSelectedTab] = useState(0);

    const [category, setCategory] = useState("top");
    const [colors, setColors] = useState("");
    const [formality, setFormality] = useState("casual");
    const [weather, setWeather] = useState([]);
    const [imageUrl, setImageUrl] = useState(""); // Temporary (will replace with Firebase Storage later)
    const [clothing, setClothing] = useState([newClothingItem]); // Stores added clothing items
    
    const [modalVisible, setModalVisible] = useState(false); // Controls modal visibility

    // 🔹 Fetch Clothing when screen loads or category changes
    useEffect(() => {

        const loadClothing = async () => {
            const items = await fetchClothingByCategory(userId, category);
            console.log("Fetched clothing:", items);
            setClothing(items);
        };
        loadClothing();
    }, [category]); // Refetch when category changes

    // 🔹 Add Clothing Item
    const handleAddClothing = async () => {
        if (!category || !colors || !formality || !weather || !imageUrl) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        const clothingData = {
            category,
            colors: colors.split(",").map(c => c.trim()), // Convert to array
            formality,
            weather: weather.split(",").map(w => w.trim()), // Convert to array
            imageUrl,
        };

        await addClothingItem(userId, clothingData);
        Alert.alert("Success", "Clothing item added!");
        setModalVisible(false);
        fetchUpdatedClothing();
    };

    // 🔹 Fetch updated clothing after adding new item
    const fetchUpdatedClothing = async () => {
        const items = await fetchClothingByCategory(userId, category);
        setClothing(items);
    };

    // 🔹 Delete Clothing
    const handleDeleteClothing = (clothingId) => {
        deleteClothingItem(userId, clothingId);
        setClothing(clothing.filter(item => item.id !== clothingId)); // Update UI
    };

    // Render clothing items (use imageUrl from Firebase)
    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: newClothingItem.imageUrl }} style={styles.image} />
            {/* <Text>{item.category.toUpperCase()}</Text>
            <Text>Colors: {item.colors.join(", ")}</Text>
            <Text>Formality: {item.formality}</Text>
            <Text>Weather: {item.weather.join(", ")}</Text> */}
            <TouchableOpacity onPress={() => handleDeleteClothing(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

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
            {clothing.length > 0 ? (
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
            <View style={{ flex: 1, padding: 20, position: "relative" }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add Clothing</Text>

                    <TextInput style={styles.input} placeholder="Colors (comma-separated)" value={colors} onChangeText={setColors} />
                    <TextInput style={styles.input} placeholder="Weather (comma-separated)" value={weather} onChangeText={setWeather} />
                    <TextInput style={styles.input} placeholder="Image URL (Firebase Storage)" value={imageUrl} onChangeText={setImageUrl} />

                    <Button title="Add Item" onPress={handleAddClothing} />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
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
    plusButton: { position: "absolute", top: 30, right: 20, backgroundColor: "white", borderRadius: 50, padding: 10, elevation: 5 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 5, width: "80%" },
    modal: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white", padding: 20 }
});

export default Closet;
