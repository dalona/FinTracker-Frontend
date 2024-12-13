import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import api from '../api/api';
import Icon from 'react-native-vector-icons/FontAwesome'; // Cambia FontAwesome a la fuente que prefieras

interface Transaction {
  id: number;
  name: string;
  type: 'Income' | 'Expense';
  amount: number;
  date: string;
  note?: string;
}

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Income' | 'Expense'>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data.data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las transacciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'All') return true;
    return transaction.type === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionName}>{item.name}</Text>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === 'Income' ? '#4CAF50' : '#FF0000' },
        ]}
      >
        {item.type === 'Income' ? `+ $${item.amount}` : `- $${item.amount}`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          {/* Botones de Filtro */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'All' && styles.activeFilterButton,
              ]}
              onPress={() => setFilter('All')}
            >
              <Icon name="list" size={16} color={filter === 'All' ? '#fff' : '#333'} />
              <Text style={styles.filterButtonText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'Income' && styles.activeFilterButton,
              ]}
              onPress={() => setFilter('Income')}
            >
              <Icon name="arrow-up" size={16} color={filter === 'Income' ? '#fff' : '#333'} />
              <Text style={styles.filterButtonText}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'Expense' && styles.activeFilterButton,
              ]}
              onPress={() => setFilter('Expense')}
            >
              <Icon name="arrow-down" size={16} color={filter === 'Expense' ? '#fff' : '#333'} />
              <Text style={styles.filterButtonText}>Expense</Text>
            </TouchableOpacity>
          </View>

          {/* Botón de Ordenamiento */}
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          >
            <Icon
              name={sortOrder === 'asc' ? 'sort-amount-asc' : 'sort-amount-desc'}
              size={20}
              color="#333"
            />
            <Text style={styles.sortButtonText}>
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Text>
          </TouchableOpacity>

          {/* Lista de Transacciones */}
          <FlatList
            data={sortedTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF9F5',
    padding: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8F7C5',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  filterButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionsScreen;
