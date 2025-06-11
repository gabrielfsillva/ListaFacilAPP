import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import {
  Ionicons,
  FontAwesome,
  Entypo,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { style } from "./styles";
import { themes } from "../../global/themes";
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AuthContextList } from "../../context/authContext_list";

interface AuthContextListType {
  onOpen: () => void;
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const context = useContext(AuthContextList);

  if (!context || !context.onOpen) {
    throw new Error("AuthContextList is not available or missing onOpen");
  }

  const { onOpen } = context;

  const go = (screenName: string) => {
    navigation.navigate(screenName);
  }

  return (
    <View style={style.tabArea}>
      <TouchableOpacity
        style={style.tabItem}
        onPress={() => go("List")}
        accessibilityRole="button"
        accessibilityLabel="Ir para lista"
      >
        <AntDesign
          name="bars"
          style={[
            style.icon,
            { opacity: state.index === 0 ? 1 : 0.3, color: themes.Colors.primary }
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={style.tabItemButton}
        onPress={() => onOpen()}
        accessibilityRole="button"
        accessibilityLabel="Abrir ação principal"
      >
        <View style={style.plusIconWrapper}>
          <Entypo name="plus" size={40} color="#FFF" />
        </View>
        <View style={style.editIconWrapper}>
          <MaterialIcons name="edit" color="#FFF" size={30} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={style.tabItem}
        onPress={() => go("User")}
        accessibilityRole="button"
        accessibilityLabel="Ir para perfil do usuário"
      >
        <FontAwesome
          name="user"
          style={[
            style.icon,
            { opacity: state.index === 1 ? 1 : 0.3, color: themes.Colors.primary }
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}
