import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import api from '../api/api'; // Asegúrate de tener la configuración de tu API

interface Props {
  visible: boolean;
  onClose: () => void;
  onTransactionCreated: () => void; // Para refrescar la lista después de agregar
}

const NewTransactionForm: React.FC<Props> = ({ visible, onClose, onTransactionCreated }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Income' | 'Expense' | ''>('');
  const [category, setCategory] = useState('');

  const handleSubmit = async () => {
    if (!name || !amount || !type || !category) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await api.post('/transactions', {
        name,
        amount: parseFloat(amount),
        type,
        categorizedBudgetId: category, // Debes ajustar esto al ID de la categoría real
      });
      Alert.alert('Éxito', 'Transacción creada correctamente');
      setName('');
      setAmount('');
      setType('');
      setCategory('');
      onTransactionCreated(); // Notificar a la pantalla principal
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo crear la transacción');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.title}>Nueva Transacción</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Monto"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'Income' && styles.activeTypeButton,
              ]}
              onPress={() => setType('Income')}
            >
              <Icon name="arrow-up" size={20} color={type === 'Income' ? '#fff' : '#4CAF50'} />
              <Text style={styles.typeText}>Ingreso</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'Expense' && styles.activeTypeButton,
              ]}
              onPress={() => setType('Expense')}
            >
              <Icon name="arrow-down" size={20} color={type === 'Expense' ? '#fff' : '#FF0000'} />
              <Text style={styles.typeText}>Gasto</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Categoría"
            value={category}
            onChangeText={setCategory}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8F7C5',
    padding: 10,
    borderRadius: 8,
  },
  activeTypeButton: {
    backgroundColor: '#4CAF50',
  },
  typeText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
  },
  cancelText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewTransactionForm;
