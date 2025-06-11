import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { themes } from "../global/themes";
import { Flag } from "../components/Flag";
import { Input } from "../components/Input";
import { Modalize } from "react-native-modalize";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import CustomDateTimePicker from "../components/CustomDateTimePicker";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Loading } from "../components/Loading";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getFirestore,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../services/firebaseConfig.js"; 

const db = getFirestore(app);

export interface Task {
  userId: string;
  item: number; 
  title: string;
  description: string;
  flag: string;
  timeLimit: string; 
}

interface AuthContextType {
  onOpen: () => void;
  taskList: Task[];
  handleEdit: (item: Task) => void;
  handleDelete: (item: Task) => void;
  taskListBackup: Task[];
  filter: (t: string) => void;
}

export const AuthContextList = createContext<AuthContextType | undefined>(
  undefined
);

const flags = [
  { caption: "urgente", color: themes.Colors.red },
  { caption: "opcional", color: themes.Colors.blueLigth },
];

interface AuthProviderListProps {
  children: ReactNode;
}

export const AuthProviderList = ({ children }: AuthProviderListProps) => {
  const modalizeRef = useRef<Modalize>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("urgente");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Task state
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [taskListBackup, setTaskListBackup] = useState<Task[]>([]);

  const [item, setItem] = useState<number>(0); // id da tarefa (timestamp)
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Busca tarefas do usuário no Firestore
  const get_taskList = async (uid: string) => {
    try {
      setLoading(true);
      const q = query(collection(db, "tasks"), where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => doc.data() as Task);
      setTaskList(list);
      setTaskListBackup(list);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      alert("Erro ao buscar tarefas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        get_taskList(user.uid);
      } else {
        setUserId(null);
        setTaskList([]);
        setTaskListBackup([]);
      }
    });
    return unsubscribe;
  }, []);

  // Abre modal de tarefa
  const onOpen = () => modalizeRef.current?.open();
  // Fecha modal
  const onClose = () => modalizeRef.current?.close();

  // Atualiza data e hora selecionadas
  const handleDateChange = (date: Date) => setSelectedDate(date);
  const handleTimeChange = (date: Date) => setSelectedTime(date);

  // Salva ou atualiza a tarefa no Firestore
  const handleSave = async () => {
    if (!userId) return;

    if (!title.trim()) {
      alert("O título é obrigatório.");
      return;
    }

    const newItem: Task = {
      userId,
      item: item !== 0 ? item : Date.now(),
      title: title.trim(),
      description: description.trim(),
      flag: selectedFlag,
      timeLimit: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      ).toISOString(),
    };

    onClose();

    try {
      setLoading(true);
      // Procura se tarefa já existe (editar)
      const itemQuery = query(
        collection(db, "tasks"),
        where("userId", "==", userId),
        where("item", "==", newItem.item)
      );
      const snapshot = await getDocs(itemQuery);

      if (!snapshot.empty) {
        // Atualiza tarefa existente
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, {
          userId: newItem.userId,
          item: newItem.item,
          title: newItem.title,
          description: newItem.description,
          flag: newItem.flag,
          timeLimit: newItem.timeLimit,
        });
      } else {
        // Adiciona nova tarefa
        await addDoc(collection(db, "tasks"), newItem);
      }

      await get_taskList(userId);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar no Firestore:", error);
      alert("Erro ao salvar tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Filtra tarefas por texto nos campos title ou description
  const filter = (t: string) => {
    if (taskListBackup.length === 0) return;

    if (t.trim() === "") {
      setTaskList(taskListBackup);
      return;
    }

    const searchTerm = t.trim().toLowerCase();

    const filteredArr = taskListBackup.filter((item) =>
      ["title", "description"].some((field) => {
        const value = (item as any)[field];
        return (
          typeof value === "string" && value.toLowerCase().includes(searchTerm)
        );
      })
    );

    setTaskList(filteredArr);
  };

  // Preenche o formulário para editar uma tarefa
  const handleEdit = (itemToEdit: Task) => {
    setTitle(itemToEdit.title);
    setDescription(itemToEdit.description);
    setSelectedFlag(itemToEdit.flag);
    setItem(itemToEdit.item);

    const timeLimit = new Date(itemToEdit.timeLimit);
    setSelectedDate(timeLimit);
    setSelectedTime(timeLimit);

    onOpen();
  };

  // Exclui tarefa do Firestore
  const handleDelete = async (itemToDelete: Task) => {
    if (!userId) return;
    try {
      setLoading(true);
      const itemQuery = query(
        collection(db, "tasks"),
        where("userId", "==", userId),
        where("item", "==", itemToDelete.item)
      );
      const snapshot = await getDocs(itemQuery);

      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        await deleteDoc(docRef);
      }

      await get_taskList(userId);
    } catch (error) {
      console.error("Erro ao excluir item no Firestore:", error);
      alert("Erro ao excluir tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // (Removido bloco duplicado e inválido que usava 'uid' não definido)

  // Reseta formulário para criação
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedFlag("urgente");
    setItem(0);
    setSelectedDate(new Date());
    setSelectedTime(new Date());
  };

  // Renderiza as flags para seleção
  const _renderFlags = () =>
    flags.map((flagItem, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedFlag(flagItem.caption)}
        style={{ marginRight: 10 }}
      >
        <Flag
          caption={flagItem.caption}
          color={flagItem.color}
          selected={flagItem.caption === selectedFlag}
        />
      </TouchableOpacity>
    ));

  // Conteúdo do modal para criar/editar tarefa
  const _container = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={30} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {item !== 0 ? "Editar tarefa" : "Criar tarefa"}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <AntDesign name="check" size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Input
            Title="Título:"
            labelStyle={styles.label}
            value={title}
            onChangeText={setTitle}
          />
          <Input
            Title="Descrição:"
            numberOfLines={5}
            height={100}
            multiline
            labelStyle={styles.label}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInput}
            >
              <Input
                Title="Data limite:"
                labelStyle={styles.label}
                editable={false}
                value={selectedDate.toLocaleDateString()}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.timeInput}
            >
              <Input
                Title="Hora limite:"
                labelStyle={styles.label}
                editable={false}
                value={selectedTime.toLocaleTimeString()}
              />
            </TouchableOpacity>
          </View>

          <CustomDateTimePicker
            type="date"
            onDateChange={handleDateChange}
            show={showDatePicker}
            setShow={setShowDatePicker}
          />
          <CustomDateTimePicker
            type="time"
            onDateChange={handleTimeChange}
            show={showTimePicker}
            setShow={setShowTimePicker}
          />

          <View style={styles.flags}>{_renderFlags()}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <AuthContextList.Provider
      value={{
        onOpen,
        taskList,
        handleEdit,
        handleDelete,
        taskListBackup,
        filter,
      }}
    >
      {children}
      <Modalize
        ref={modalizeRef}
        snapPoint={600}
        keyboardAvoidingBehavior="padding"
      >
        {_container()}
      </Modalize>
      {loading && <Loading loading={loading} />}
    </AuthContextList.Provider>
  );
};

// Hook para consumir contexto com segurança
export const useAuthList = () => {
  const context = useContext(AuthContextList);
  if (!context) {
    throw new Error("useAuthList must be used within an AuthProviderList");
  }
  return context;
};

// Estilos atualizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 15,
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInput: {
    flex: 1,
    marginRight: 10,
  },
  timeInput: {
    flex: 1,
  },
  flags: {
    marginTop: 20,
    flexDirection: "row",
  },
});
