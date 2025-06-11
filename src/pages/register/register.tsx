import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../../services/firebaseConfig";
import { Octicons } from '@expo/vector-icons';
import { FirebaseError } from "firebase/app";

const auth = getAuth(app);

type RootStackParamList = {
  Login: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface RegisterProps {
  navigation: RegisterScreenNavigationProp;
}

export default function Register({ navigation }: RegisterProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nomeInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const senhaInputRef = useRef<TextInput>(null);

  function isEmailValid(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function isPasswordValid(password: string) {
    return password.length >= 6;
  }

  function validateFields() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return false;
    }
    if (!isEmailValid(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return false;
    }
    if (!isPasswordValid(senha)) {
      Alert.alert('Erro', 'Senha muito fraca! Use no mínimo 6 caracteres.');
      return false;
    }
    return true;
  }

  async function handleRegister() {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      await updateProfile(userCredential.user, { displayName: nome });

      Alert.alert('Sucesso', `Bem-vindo(a), ${nome}!`);

      setNome('');
      setEmail('');
      setSenha('');

      navigation.navigate('Login');
    } catch (error) {
      let message = "Erro ao criar conta!";
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        typeof (error as any).code === "string"
      ) {
        const firebaseErrorMessages: Record<string, string> = {
          "auth/email-already-in-use": "Este e-mail já está em uso!",
          "auth/invalid-email": "E-mail inválido!",
          "auth/weak-password": "Senha muito fraca! Use no mínimo 6 caracteres.",
        };
        message = firebaseErrorMessages[(error as any).code] ?? message;
      }
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          ref={nomeInputRef}
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          autoComplete="name"
          autoFocus
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => emailInputRef.current?.focus()}
        />
        <TextInput
          ref={emailInputRef}
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => senhaInputRef.current?.focus()}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            ref={senhaInputRef}
            style={[styles.input, { flex: 1 }]}
            placeholder="Senha"
            secureTextEntry={!showPassword}
            value={senha}
            onChangeText={setSenha}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            <Octicons name={showPassword ? "eye" : "eye-closed"} size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
          accessibilityState={{ disabled: loading }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
});
