import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';

export default function functionCloset() {

    const [selectedTab, setSelectedTab] = useState(0);

    const tabs = ['Recents', 'Tops', 'Bottoms', 'Accessories'];

    const handleTabPress = (index) => {
        setValue(index);
    };

    /* Store the images under each tab */
    const imageData = {
        Recents: [
            require('../../assets/images/react-logo.png'),
            require('../../assets/images/adaptive-icon.png'),
            require('../../assets/images/react-logo.png'),
            require('../../assets/images/react-logo.png'),
        ],
        Tops: [
            require('../../assets/images/react-logo.png'),
            require('../../assets/images/adaptive-icon.png'),
            require('../../assets/images/react-logo.png'),
        ],
        Bottoms: [
            require('../../assets/images/adaptive-icon.png'),
            require('../../assets/images/react-logo.png'),
        ],
        Accessories: [
            require('../../assets/images/adaptive-icon.png'),
            require('../../assets/images/react-logo.png'),
            require('../../assets/images/adaptive-icon.png'),
            require('../../assets/images/react-logo.png'),
        ],
    };

    /* Load image */
    const renderItem = ({item}) => (
        <View style={styles.imageContainer}>
            <Image source={item} style={styles.image} />
        </View>
    );

    return (
        <View style={styles.screen}>
            
            <View style={styles.topTitleContainer}> {/* Title text */}
                <Text style={styles.topTitleText}>
                    My Closet
                </Text>
            </View>

            <View style={styles.tabBar}> {/* Tabs */}
                {tabs.map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.tabItem, selectedTab === index&&styles.activeTab]}
                        onPress={() => setSelectedTab(index)}
                    >
                        <Text style={[styles.tabText, selectedTab === index && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            <FlatList /* Load images for selected tab */
                data={imageData[tabs[selectedTab]]}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.grid}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fffcee',
    },
    topTitleText: {
        fontSize: 40,
        fontWeight: 'bold',
        backgroundColor: '#e8def8',
        padding: 10,
        paddingHorizontal: 30,
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 5,
        borderColor: 'black',
        borderRadius: 10,
    },
    topTitleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    tabBar: {
        flexDirection: 'row',
        justiftContent: 'space-around',
        paddingVertical: 10,
    },
    tabItem: {
        paddingVertical: 8,
        paddingInline: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    tabText: {
        fontSize: 20,
        color: 'gray'
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
    },
    activeTabText: {
        color: 'black',
        fontWeight: 'bold'
    },
    grid: {
        padding: 10,
        alignItems: 'center',
    },
    imageContainer: {
        backgroundColor: 'black',
        margin: 10,
        borderRadius: 20,
        width: 155,
        height: 155,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 155,
        height: 155,
        tintColor: 'white',
    },
});
