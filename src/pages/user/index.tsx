import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { styles } from '../user/styles';

import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { app } from '../../services/firebaseConfig';

const auth = getAuth(app);

type RootStackParamList = {
  Login: undefined;
  User: undefined;
};

export default function User() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'User'>>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [reauthLoading, setReauthLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setNome(user.displayName || '');
      setEmail(user.email || '');
    }
  }, []);

  function isEmailValid(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setNome('');
      setEmail('');
      setSenha('');
      navigation.reset({ routes: [{ name: 'Login' }] });
    } catch {
      Alert.alert('Erro', 'Não foi possível sair da conta. Tente novamente.');
    }
  };

  async function reauthenticateUser(currentPassword: string) {
    if (!auth.currentUser || !auth.currentUser.email) return false;
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      return true;
    } catch {
      return false;
    }
  }

  async function updateUserData() {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Erro', 'Nome e e-mail são obrigatórios.');
      setLoading(false);
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert('Erro', 'E-mail inválido.');
      setLoading(false);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      setLoading(false);
      return;
    }

    try {
      if (user.displayName !== nome) {
        await updateProfile(user, { displayName: nome });
      }
      if (user.email !== email) {
        await updateEmail(user, email);
      }
      if (senha) {
        if (senha.length < 6) {
          Alert.alert('Erro', 'Senha deve ter no mínimo 6 caracteres.');
          setLoading(false);
          return;
        }
        await updatePassword(user, senha);
      }
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      setSenha('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setModalVisible(true);
      } else {
        console.error(error);
        let message = 'Erro ao atualizar dados.';
        if (error.code === 'auth/invalid-email') {
          message = 'E-mail inválido.';
        }
        Alert.alert('Erro', message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSalvar = async () => {
    if (loading || reauthLoading) return; // evita múltiplos cliques
    setLoading(true);
    await updateUserData();
  };

  const handleReauthenticate = async () => {
    if (!senhaAtual.trim()) {
      Alert.alert('Erro', 'Informe sua senha atual para continuar.');
      return;
    }
    setReauthLoading(true);
    const success = await reauthenticateUser(senhaAtual);
    setReauthLoading(false);
    if (success) {
      setModalVisible(false);
      setSenhaAtual('');
      setLoading(true);
      await updateUserData();
    } else {
      Alert.alert('Erro', 'Senha atual incorreta.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        editable={!loading && !reauthLoading}
        autoComplete="name"
        returnKeyType="next"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading && !reauthLoading}
        autoComplete="email"
        returnKeyType="next"
      />

      <Text style={styles.label}>Senha (deixe em branco para não alterar)</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          editable={!loading && !reauthLoading}
          returnKeyType="done"
          onSubmitEditing={handleSalvar}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
          disabled={loading || reauthLoading}
          accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, (loading || reauthLoading) && { opacity: 0.7 }]}
        onPress={handleSalvar}
        disabled={loading || reauthLoading}
        accessibilityRole="button"
        accessibilityLabel="Salvar alterações"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        accessibilityLabel="Sair da Conta"
        accessibilityRole="button"
        disabled={loading || reauthLoading}
      >
        <Ionicons name="exit" size={32} color="gray" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      {/* Modal para reautenticação */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!reauthLoading) setModalVisible(false);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reautenticação Necessária</Text>
            <Text style={styles.modalText}>
              Por motivos de segurança, informe sua senha atual para continuar.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Senha atual"
              secureTextEntry
              autoCapitalize="none"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              editable={!reauthLoading}
              returnKeyType="done"
              onSubmitEditing={handleReauthenticate}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => !reauthLoading && setModalVisible(false)}
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                disabled={reauthLoading}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleReauthenticate}
                style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
                disabled={reauthLoading}
              >
                {reauthLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff' }}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
