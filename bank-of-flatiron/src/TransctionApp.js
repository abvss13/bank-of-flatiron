import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const TransactionApp = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('https://api.npoint.io/24f85e9a6815d12cf771');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
  };

  const filterTransactions = (searchTerm) => {
    if (!searchTerm) {
      fetchTransactions();
    } else {
      const filteredTransactions = transactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTransactions(filteredTransactions);
    }
  };

  const sortTransactions = (sortBy) => {
    const sortedTransactions = [...transactions].sort((a, b) => {
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      } else if (sortBy === 'description') {
        return a.description.localeCompare(b.description);
      }
      return 0;
    });
    setTransactions(sortedTransactions);
  };

  const deleteTransaction = (transactionId) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== transactionId);
    setTransactions(updatedTransactions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Get the form data 
    const description = e.target.elements.description.value;
    const amount = e.target.elements.amount.value;
    // Generate a new transaction object 
    const newTransaction = {
      id: transactions.length + 1,
      description,
      amount: parseFloat(amount),
    };
    // Add the new transaction to the table
    addTransaction(newTransaction);
    // Clear the form inputs
    e.target.reset();
  };

  return (
    <div className="container">
      <header>
        <h1>Bank of Flatiron</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <input type="text" name="description" placeholder="Description" />
        <input type="number" name="amount" placeholder="Amount" />
        <button type="submit">Add Transaction</button>
      </form>

      <input
        type="text"
        placeholder="Search transactions..."
        onChange={(e) => filterTransactions(e.target.value)}
      />

      <button onClick={() => sortTransactions('category')}>Sort by Category</button>
      <button onClick={() => sortTransactions('description')}>Sort by Description</button>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>
                <button onClick={() => deleteTransaction(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionApp;
