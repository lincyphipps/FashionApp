import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, TouchableOpacity, Modal } from "react-native";
import { addClothingItem, fetchClothingByCategory, deleteClothingItem } from "../../firebase/firebaseService";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";


const Closet = () => {
    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Get logged-in user ID

    const [category, setCategory] = useState("top");
    const [colors, setColors] = useState("");
    const [formality, setFormality] = useState("casual");
    const [weather, setWeather] = useState([]);
    const [imageUrl, setImageUrl] = useState(""); // Temporary (will replace with Firebase Storage later)
    const [clothing, setClothing] = useState([]); // Stores added clothing items
    const [modalVisible, setModalVisible] = useState(false); // Controls modal visibility

    // 🔹 Fetch Clothing when screen loads or category changes
    useEffect(() => {

        const loadClothing = async () => {
            const items = await fetchClothingByCategory(userId, category);
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

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {/* Header with Small "+" Button */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>My Closet</Text>

                {/* Small "+" Button to Open Modal */}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.plusButton}>
                    <Ionicons name="add-circle-outline" size={30} color="black" />
                </TouchableOpacity>
            </View>

            {/* Category Selector */}
            <Text>Select Category:</Text>
            <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                <Picker.Item label="Top" value="top" />
                <Picker.Item label="Bottom" value="bottom" />
                <Picker.Item label="Shoes" value="shoes" />
                <Picker.Item label="Accessory" value="accessory" />
            </Picker>

            {/* Clothing List */}
            <FlatList
                data={clothing}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ddd" }}>
                        <Text>{item.category.toUpperCase()}</Text>
                        <Text>Colors: {item.colors.join(", ")}</Text>
                        <Text>Formality: {item.formality}</Text>
                        <Text>Weather: {item.weather.join(", ")}</Text>
                        <TouchableOpacity onPress={() => handleDeleteClothing(item.id)} style={styles.deleteButton}>
                            <Ionicons name="trash-outline" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Modal for Adding Clothing */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modal}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add Clothing</Text>

                    <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                        <Picker.Item label="Top" value="top" />
                        <Picker.Item label="Bottom" value="bottom" />
                        <Picker.Item label="Shoes" value="shoes" />
                        <Picker.Item label="Accessory" value="accessory" />
                    </Picker>

                    <TextInput style={styles.input} placeholder="Colors (comma-separated)" value={colors} onChangeText={setColors} />
                    <Picker selectedValue={formality} onValueChange={(itemValue) => setFormality(itemValue)}>
                        <Picker.Item label="Casual" value="casual" />
                        <Picker.Item label="Formal" value="formal" />
                    </Picker>
                    <TextInput style={styles.input} placeholder="Weather (comma-separated)" value={weather} onChangeText={setWeather} />
                    <TextInput style={styles.input} placeholder="Image URL (temporary)" value={imageUrl} onChangeText={setImageUrl} />

                    <Button title="Add Item" onPress={handleAddClothing} />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
}

const styles = {
    plusButton: {
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
    },
    deleteButton: {
        marginTop: 5,
    },
    modal: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
};

export default Closet;
