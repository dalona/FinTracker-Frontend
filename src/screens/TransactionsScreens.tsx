import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/api';

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'Income' | 'Expense';
}

interface Category {
  id: number;
  category: string;
}

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState(''); // Campo para nueva categoría
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Income' | 'Expense'>('Income');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categorize-budget');
      setCategories(response.data?.data || []);
    } catch (error: any) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }
    try {
      const response = await api.post('/categorize-budget', {
        category: newCategory,
        amount: 1000, // Cantidad por defecto
        date: new Date().toISOString().split('T')[0],
      });
      await fetchCategories(); // Recargar categorías después de agregar
      setSelectedCategory(response.data.data.id); // Seleccionar automáticamente la nueva categoría
      setNewCategory(''); // Limpiar el campo
    } catch (error: any) {
      console.error('Error al agregar categoría:', error);
      Alert.alert('Error', 'Failed to add category');
    }
  };

  const addTransaction = async () => {
    if (!name || !amount || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const newTransaction = {
        name,
        amount: parseFloat(amount),
        type,
        categorizedBudgetId: selectedCategory,
        date: new Date().toISOString().split('T')[0],
      };

      const response = await api.post('/transactions', newTransaction);
      setTransactions((prev) => [...prev, response.data.data]);
      resetForm();
      setModalVisible(false);
    } catch (error: any) {
      console.error('Error al agregar transacción:', error);
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setType('Income');
    setSelectedCategory('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.transactionItem,
                item.type === 'Expense' ? styles.expense : styles.income,
              ]}
            >
              <Text style={styles.transactionText}>
                {item.name} - ${item.amount} ({item.type})
              </Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Transaction</Text>

            <TextInput
              style={styles.input}
              placeholder="Transaction Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.label}>Select Category</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <Picker.Item label="Select Category" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.category} value={cat.id} />
              ))}
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Or Add New Category"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <TouchableOpacity style={styles.addCategoryButton} onPress={addCategory}>
              <Text style={styles.addCategoryButtonText}>+ Add New Category</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButtonModal}
                onPress={addTransaction}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  income: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50', // Verde para ingresos
  },
  expense: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF6347', // Rojo para gastos
  },
  transactionText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  addCategoryButton: {
    backgroundColor: '#28a745', // Verde para el botón de agregar categoría
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addCategoryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    padding: 10,
  },
  cancelText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  addButtonModal: {
    backgroundColor: '#4CAF50', // Verde para el botón de agregar
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});


export default TransactionsScreen;
