import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
    boxInput:{
            width:'100%',
            height:40,
            borderWidth:1,
            borderRadius:40,
            borderColor:themes.Colors.lightGray,
            backgroundColor:themes.Colors.bgScreen,
            marginTop:10,
            flexDirection:'row',
            alignItems:'center',
            paddingHorizontal:30
        },
        input: {
         height:'100%',
        width:'100%',
        borderRadius:40,
        paddingLeft: 5,
    },
    titleInput:{
        marginLeft: 5,
        color: themes.Colors.gray,
        marginTop: 20,
    },
    Icon: {
        width: '100%',
    },
    Button: {
        width: '10%',
    },
});