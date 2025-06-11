import React, { useContext, useRef } from "react";
import { style } from "../list/styles";
import { Ball } from "../../components/Ball";
import { Input } from "../../components/Input";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { Flag } from "../../components/Flag";
import { themes } from "../../global/themes";
import { AuthContextList, Task } from "../../context/authContext_list";
import {
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Share,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { formatDateToBR } from "../../global/functions";

export default function List() {
  const { taskList, handleDelete, handleEdit, filter } =
    useContext<AuthContextType>(AuthContextList);

  const swipeableRefs = useRef<Array<Swipeable | null>>([]);

  const compartilharLista = async () => {
    try {
      const listaTexto = taskList
        .map((item: Task) => `- ${item.title}`)
        .join("\n");
      await Share.share({
        message: `Minha Lista de Compras:\n\n${listaTexto}`,
      });
    } catch (error) {
      console.error("Erro ao compartilhar lista:", error);
    }
  };

  const renderRightActions = () => (
    <View style={style.Button}>
      <AntDesign name="delete" size={20} color={"#FFF"} />
    </View>
  );

  const renderLeftActions = () => (
    <View style={[style.Button, { backgroundColor: themes.Colors.blueLigth }]}>
      <AntDesign name="edit" size={20} color={"#FFF"} />
    </View>
  );

  const handleSwipeOpen = (
    direction: "right" | "left",
    item: Task,
    index: number
  ) => {
    if (direction === "right") {
      handleDelete(item);
      swipeableRefs.current[index]?.close();
    } else if (direction === "left") {
      handleEdit(item);
      swipeableRefs.current[index]?.close();
    }
  };

  const _renderCard = (item: Task, index: number) => {
    const color =
      item.flag === "opcional" ? themes.Colors.blueLigth : themes.Colors.red;
    return (
      <Swipeable
        ref={(ref) => {
          swipeableRefs.current[index] = ref;
        }}
        key={item.item}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={(direction) => handleSwipeOpen(direction, item, index)}
      >
        <View style={style.card}>
          <View style={style.rowCard}>
            <View style={style.rowCardLeft}>
              <Ball color={color} />
              <View>
                <Text style={style.titleCard}>{item.title}</Text>
                <Text style={style.descriptionCard}>{item.description}</Text>
                <Text style={style.descriptionCard}>
                  até {formatDateToBR(item.timeLimit)}
                </Text>
              </View>
            </View>
            <Flag caption={item.flag} color={color} />
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={style.container}>
      <StatusBar barStyle="light-content" />
      <View style={style.header}>
        <Text style={style.greeting}>
          Bem-vindo! Organize-se com o{" "}
          <Text style={{ fontWeight: "bold" }}>ListaFácil</Text>.
        </Text>
        <View style={style.boxInput}>
          <Input
            IconLeft={MaterialIcons}
            IconLeftName="search"
            onChangeText={(t) => filter(t)}
          />
        </View>

        <TouchableOpacity style={style.shareButton} onPress={compartilharLista}>
          <Ionicons name="share-social" size={20} color="#fff" />
          <Text style={style.shareText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

      <View style={style.boxList}>
        <FlatList
          data={taskList}
          style={{ marginTop: 40, paddingHorizontal: 30 }}
          keyExtractor={(item) => item.item.toString()}
          renderItem={({ item, index }) => _renderCard(item, index)}
        />
      </View>
    </View>
  );
}
