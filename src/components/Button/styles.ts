import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
   button: {
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themes.Colors.primary,
        borderRadius: 40,
        shadowColor : "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        
    },
    textButton: {
        fontSize: 16,
        color: '#FFFF',
        fontWeight: 'bold',
    },
});