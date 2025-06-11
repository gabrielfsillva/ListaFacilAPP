import React, { useState } from "react";
import { style } from "./styles";
import Logo from "../../assets/Logo.png";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Text, View, Image, Alert, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons, Octicons } from "@expo/vector-icons";

export default function Login() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [email, setEmail] = useState("teste@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  async function getLogin() {
    try {
      setLoading(true);

      if (!email || !password) {
        return Alert.alert("Atenção", "Informe os campos obrigatórios!");
      }

      if (email === "teste@gmail.com" && password === "123456") {
        return navigation.reset({ routes: [{ name: "BottomRoutes" }] });
      }

      Alert.alert("Atenção", "E-mail ou senha invalida!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <View style={style.boxTop}>
        <Image source={Logo} style={style.logo} resizeMode="contain" />
        <Text style={style.text}>Bem vindo de volta!</Text>
      </View>
      <View style={style.boxMid}>
        <Input
          Title="ENDEREÇO E-MAIL"
          value={email}
          onChangeText={setEmail}
          IconRight={MaterialIcons}
          IconRightName="email"
          onIconRightPress={() => console.log("OLA")}
        />
        <Input
          Title="SENHA"
          value={password}
          onChangeText={setPassword}
          IconRight={Octicons}
          IconRightName={showPassword ? "eye-closed" : "eye"}
          onIconRightPress={() => setShowPassword(!showPassword)}
          secureTextEntry={true}
          multiline={false}
        />
      </View>
      <View style={style.boxBottom}>
        <Button text="ENTRAR" loading={loading} onPress={() => getLogin()} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ color: "#007bff", textAlign: "center", marginTop: 16 }}>
          Criar uma conta
        </Text>
      </TouchableOpacity>
      {/* <Text style={style.textBottom}>Não tem conta? <Text  style={style.textBottomCreate}>Crie agora</Text></Text> */}
    </View>
  );
}
