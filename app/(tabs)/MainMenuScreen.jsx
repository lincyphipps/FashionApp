import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default function MyScreen() {
    return(
        <View style={styles.TitleContainer}>
            <Text style={styles.TitleText}>"Fashion App"</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    TitleContainer:{
        flex: 1,    //figure out the flex
        backgroundColor:'#D0BCFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TitleText:{
        fontSize: 34,
        fontWeight: 400,
    },
});
//export default MyScreen; //this is the default export