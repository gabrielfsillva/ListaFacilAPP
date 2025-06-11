import { StyleSheet, Dimensions } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: Dimensions.get("window").height / 6,
    backgroundColor: themes.Colors.primary,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 20,
    color: "#FFF",
    marginTop: 20,
  },
  boxInput: {
    width: "80%",
  },
  boxList: {
    flex: 1,
    width: "100%",
  },
  card: {
    width: "100%",
    minHeight: 60,
    backgroundColor: "#FFF",
    marginTop: 6,
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: themes.Colors.lightGray,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleCard: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionCard: {
    color: themes.Colors.gray,
  },
  rowCardLeft: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
  },
  Button: {
    backgroundColor: "#e53935",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
  ButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: themes.Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  shareText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});
