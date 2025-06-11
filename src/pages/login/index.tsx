import React, { useState } from "react";
import {
  style
} from "./styles";
import Logo from "../../assets/Logo.png";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import {
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { auth } from "../../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function Login() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getLogin() {
    if (!email || !password) {
      return Alert.alert("Atenção", "Informe os campos obrigatórios!");
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigation.reset({ routes: [{ name: "BottomRoutes" }] });
    } catch (error) {
      let message = "Erro ao fazer login!";
      if (error instanceof FirebaseError) {
        const firebaseErrorMessages: Record<string, string> = {
          "auth/user-not-found": "Usuário não encontrado!",
          "auth/wrong-password": "Senha incorreta!",
          "auth/invalid-email": "E-mail inválido!",
        };
        message = firebaseErrorMessages[error.code] ?? message;
      }
      Alert.alert("Atenção", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
          />
          <Input
            Title="SENHA"
            value={password}
            onChangeText={setPassword}
            IconRight={Octicons}
            IconRightName={showPassword ? "eye" : "eye-closed"}
            onIconRightPress={() => setShowPassword(!showPassword)}
            secureTextEntry={!showPassword}
            multiline={false}
          />
        </View>
        <View style={style.boxBottom}>
          <Button text="ENTRAR" loading={loading} onPress={getLogin} />
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessible={true}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={{ color: "#007bff", textAlign: "center", marginTop: 16 }}>
            Criar uma conta
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
