import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signOut, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyScreen() {
    const navigation = useNavigation();

    const handleSignOut = async () => {
        try {
          await signOut(getAuth());
          await AsyncStorage.removeItem('currentUser');
          navigation.replace('Login'); // replace with your login screen route
        } catch (error) {
          alert('Failed to log out');
        }
      };

    return(
        <View style={styles.PageContainer}>
            <View 
                style={[styles.rectangle, {backgroundColor: '#D0BCFF'}, {height:90}, {top:150}]} >
                <Text style={styles.TitleText}>FashionApp</Text>
                
            </View>

            <Icon 
                onPress={handleSignOut}
                style={[styles.iconContainer, { left: 310 }, { top: 75 }]}
                name="log-in-outline"
                iconType="Ionicons"
            />
            
            <Icon     //settings
                onPress={() => alert("settings")}
                style={[styles.iconContainer, {left: 30},{top:75}]}
                name="gear"
                iconType="FontAwesome"
            /> 

            <Rectangle 
                text="Upload Photos" 
                onPress={() => navigation.navigate('Closet')} 
                style = {{top: 360}}
            />

            <Rectangle text="Open Closet" 
                onPress={() => navigation.navigate('Closet')} 
                style = {{top: 460}}
            />

            <Rectangle text="Matching" 
                onPress={() => navigation.navigate('MatchingPage')} 
                style = {{top: 560}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    PageContainer:{ //essentially the background
        flex: 1,    //figure out the flex
        backgroundColor:'#FFFCEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TitleText:{ //text for "Fashion App"
        fontFamily: 'Aclonica',
        fontSize: 34,
        fontWeight: 400,
        color: '#FFF',
        shadowColor: '#000',
    },
    iconContainer:{
        position: 'absolute',
    },
    rectangle:{ //the rectangle for the icons lol
        position: 'absolute',
        width: 314,
        height: 76,
        backgroundColor: '#E8DEFF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: 1, 
        borderColor: '#000',
    },
    circle:{
        position: 'absolute',
        width: 50,
        height: 50,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4F378A',
        borderRadius: '50%',
    }
});

//reusable for buttons and shapes
const Rectangle = ({text, onPress, style}) => {
    if(onPress){    //if "onPress" is present, it is a button rather than a static shape
        return(
        <TouchableOpacity 
            style={[styles.rectangle, style]} 
            onPress={onPress}> 
            <Text style={styles.TitleText}>{text}</Text>
        </TouchableOpacity> //touchable opacity for button too
        );
    }
    else{
        return(<View style={styles.rectangle} />);
    }

} 
const Icon = ({ onPress, style, name, iconType }) => {
    let IconComponent;
  
    // Determine which icon library to use
    switch (iconType) {
      case 'Ionicons':
        IconComponent = Ionicons;
        break;
      case 'FontAwesome':
        IconComponent = FontAwesome;
        break;
      default:
        return null;
    }
  
    return (
      <TouchableOpacity style={[styles.iconContainer, style]} onPress={onPress}>
        <IconComponent name={name} size={40} color="#6d5e9c" />
      </TouchableOpacity>
    );
  };
  

// const shapestyles = StyleSheet.create({
    

// });
