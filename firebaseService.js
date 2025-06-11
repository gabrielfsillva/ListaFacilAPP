import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Busca todos os itens da coleção "itens"
export const buscarItens = async () => {
  try {
    const lista = [];
    const querySnapshot = await getDocs(collection(db, "itens"));
    querySnapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    return lista;
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    throw error;
  }
};

// Cadastra um novo item na coleção "itens"
export const cadastrarItem = async (item) => {
  try {
    const docRef = await addDoc(collection(db, "itens"), item);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao cadastrar item:", error);
    throw error;
  }
};

// Deleta um item pelo ID da coleção "itens"
export const deletarItem = async (id) => {
  try {
    await deleteDoc(doc(db, "itens", id));
  } catch (error) {
    console.error("Erro ao deletar item:", error);
    throw error;
  }
};
