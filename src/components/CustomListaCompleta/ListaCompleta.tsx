import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ListaCompleta() {
  const [itens, setItens] = useState([
    { id: '1', nome: 'Arroz', comprado: false },
    { id: '2', nome: 'Feijão', comprado: false },
    { id: '3', nome: 'Leite', comprado: false },
    { id: '4', nome: 'Café', comprado: false },
    { id: '5', nome: 'Açúcar', comprado: false },
  ]);

  const toggleComprado = (id: string) => {
    setItens(prev =>
      prev.map(item =>
        item.id === id ? { ...item, comprado: !item.comprado } : item
      )
    );
  };

  const compartilharLista = async () => {
    try {
      const listaTexto = itens.map(item => `- ${item.nome} ${item.comprado ? '(comprado)' : ''}`).join('\n');
      await Share.share({
        message: `Minha Lista de Compras:\n\n${listaTexto}`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar lista:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Lista</Text>

      <FlatList
        data={itens}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, item.comprado && styles.itemComprado]}
            onPress={() => toggleComprado(item.id)}
          >
            <Text style={styles.itemText}>{item.nome}</Text>
            {item.comprado && <Ionicons name="checkmark-circle" size={24} color="green" />}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.shareButton} onPress={compartilharLista}>
        <Ionicons name="share-social" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.shareText}>Compartilhar Lista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemComprado: {
    backgroundColor: '#d4edda',
  },
  itemText: {
    fontSize: 16,
  },
  shareButton: {
    marginTop: 24,
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
  },
});
