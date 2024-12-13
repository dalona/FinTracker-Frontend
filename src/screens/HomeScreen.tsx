import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [balance, setBalance] = useState({
    totalBalance: 7783.0,
    totalExpense: 1187.4,
    progress: 30,
    savings: 4000.0,
    foodLastWeek: -100.0,
    transactions: [
      { id: 1, name: 'Salary', amount: 4000.0 },
      { id: 2, name: 'Groceries', amount: -100.0 },
      { id: 3, name: 'Rent', amount: -674.4 },
    ],
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.greeting}>Hi, Welcome Back</Text>
      <Text style={styles.subGreeting}>Good Morning</Text>

      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <View style={styles.balanceCard}>
          <Text style={styles.cardTitle}>Total Balance</Text>
          <Text style={styles.cardValue}>${balance.totalBalance.toFixed(2)}</Text>
        </View>
        <View style={styles.balanceCard}>
          <Text style={styles.cardTitle}>Total Expense</Text>
          <Text style={styles.cardValue}>- ${balance.totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${balance.progress}%` }]} />
        <Text style={styles.progressText}>{balance.progress}% Of Your Expenses, Looks Good.</Text>
      </View>

      {/* Insights Section */}
      <View style={styles.insightsContainer}>
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Savings On Goals</Text>
          <Text style={styles.insightValue}>${balance.savings.toFixed(2)}</Text>
        </View>
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>Food Last Week</Text>
          <Text style={styles.insightValue}>
            {balance.foodLastWeek.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Transaction List */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <View style={styles.transactionContainer}>
        {balance.transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionRow}>
            <Text style={styles.transactionName}>{transaction.name}</Text>
            <Text
              style={[
                styles.transactionValue,
                { color: transaction.amount < 0 ? '#FF0000' : '#333' },
              ]}
            >
              {transaction.amount < 0
                ? `- $${Math.abs(transaction.amount).toFixed(2)}`
                : `$${transaction.amount.toFixed(2)}`}
            </Text>
          </View>
        ))}
      </View>

      {/* Botón para ir a la pantalla de transacciones */}
      <TouchableOpacity
        style={styles.transactionButton}
        onPress={() => navigation.navigate('Transactions')}
      >
        <Text style={styles.transactionButtonText}>View Transactions</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#EAF9F5',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 18,
    color: '#777',
    marginBottom: 20,
  },
  balanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#333',
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  insightTitle: {
    fontSize: 14,
    color: '#333',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  transactionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transactionName: {
    fontSize: 16,
    color: '#555',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  transactionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
