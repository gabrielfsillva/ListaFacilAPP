import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { styles } from '../user/styles';

export default function User() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [nome, setNome] = useState('Usuário');
  const [email, setEmail] = useState('usuario@email.com');
  const [senha, setSenha] = useState('123456');

  const handleLogout = () => {
    Alert.alert('Logout', 'Você saiu da conta.');
    navigation.reset({ routes: [{ name: 'Login' }] });
  };

  const handleSalvar = () => {
    Alert.alert('Dados salvos', `Nome: ${nome}\nE-mail: ${email}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="exit" size={32} color="gray" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}