import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
  tabArea: {
    flexDirection: "row",
    height: 80,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    backgroundColor: "#fff", // para garantir fundo branco na tab bar
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabItemButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    top: -30,
    backgroundColor: themes.Colors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  icon: {
    fontSize: 32,
    color: themes.Colors.primary,
  },
  plusIconWrapper: {
    position: "absolute",
    width: "100%",
    left: 10,
    top: 4,
  },
  editIconWrapper: {
    position: "absolute",
    flexDirection: "row-reverse",
    width: "100%",
    right: 10,
    bottom: 10,
  },
});
