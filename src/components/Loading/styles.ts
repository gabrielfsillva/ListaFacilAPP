import { StyleSheet,Dimensions} from "react-native";
import { themes } from "../../global/themes";


export const style = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:'100%',
        zIndex:9999,
        backgroundColor:themes.Colors.blackTransparent,
        alignItems:'center',
        justifyContent:'center'
    }
})