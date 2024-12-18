import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import api from '../api/api';

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'Income' | 'Expense';
  categorizedBudget: {
    category: string;
  };
  date: string; // Fecha de la transacción
}

interface Category {
  id: number;
  category: string;
}

const screenWidth = Dimensions.get('window').width;

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data.data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch transactions');
    }
  };

  const applyFilters = () => {
    const now = new Date();
    let filtered = [...transactions];

    if (filter === 'week') {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      filtered = transactions.filter((t) => new Date(t.date) >= lastWeek);
    } else if (filter === 'month') {
      const lastMonth = new Date();
      lastMonth.setMonth(now.getMonth() - 1);
      filtered = transactions.filter((t) => new Date(t.date) >= lastMonth);
    }

    setFilteredTransactions(filtered);
  };

  const calculateChartData = () => {
    const grouped: { [key: string]: number } = {};

    filteredTransactions.forEach((t) => {
      const category = t.categorizedBudget?.category || 'Uncategorized';
      if (!grouped[category]) grouped[category] = 0;

      grouped[category] += t.amount;
    });

    return Object.keys(grouped).map((key, index) => ({
      name: key,
      amount: grouped[key],
      color: getColor(index),
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    }));
  };

  const getColor = (index: number) => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    return colors[index % colors.length];
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transactions</Text>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'week' && styles.selectedFilter]}
          onPress={() => setFilter('week')}
        >
          <Text style={styles.filterText}>Last Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'month' && styles.selectedFilter]}
          onPress={() => setFilter('month')}
        >
          <Text style={styles.filterText}>Last Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.selectedFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico Circular */}
      <Text style={styles.subtitle}>Income and Expenses by Category</Text>
      <PieChart
        data={calculateChartData()}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#F9F9F9',
          backgroundGradientFrom: '#FFF',
          backgroundGradientTo: '#FFF',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={'amount'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />

      {/* Lista de Transacciones */}
      <FlatList
        data={filteredTransactions}
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
    </ScrollView>
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
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#DDD',
  },
  selectedFilter: {
    backgroundColor: '#007BFF',
  },
  filterText: {
    color: '#333',
    fontWeight: 'bold',
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
    borderLeftColor: '#4CAF50',
  },
  expense: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF6347',
  },
  transactionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default TransactionsScreen;
