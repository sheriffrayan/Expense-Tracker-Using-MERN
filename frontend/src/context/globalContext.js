import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  // Fetch incomes and expenses initially
  useEffect(() => {
    getIncomes();
    getExpenses();
  }, []);

  // Add income
  const addIncome = async (income) => {
    await axios.post(`${BASE_URL}add-income`, income).catch((err) => {
      setError(err.response.data.message);
    });
    getIncomes();
  };

  const getIncomes = async () => {
    const response = await axios.get(`${BASE_URL}get-incomes`);
    setIncomes(response.data);
  };

  const deleteIncome = async (id) => {
    await axios.delete(`${BASE_URL}delete-income/${id}`);
    getIncomes();
  };

  const totalIncome = () => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  };

  // Add expense
  const addExpense = async (expense) => {
    await axios.post(`${BASE_URL}add-expense`, expense).catch((err) => {
      setError(err.response.data.message);
    });
    getExpenses();
  };

  const getExpenses = async () => {
    const response = await axios.get(`${BASE_URL}get-expenses`);
    setExpenses(response.data);
  };

  const deleteExpense = async (id) => {
    await axios.delete(`${BASE_URL}delete-expense/${id}`);
    getExpenses();
  };

  const totalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider value={{
      addIncome,
      getIncomes,
      incomes,
      deleteIncome,
      expenses,
      totalIncome,
      addExpense,
      getExpenses,
      deleteExpense,
      totalExpenses,
      totalBalance,
      transactionHistory,
      error,
      setError
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
