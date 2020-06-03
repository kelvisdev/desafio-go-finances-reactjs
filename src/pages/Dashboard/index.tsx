import React, { useState, useEffect } from 'react';

import { FiHome } from 'react-icons/fi';
import { GiHamburger } from 'react-icons/gi';
import { RiBikeLine } from 'react-icons/ri';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';
import totalCategory from '../../assets/total-category.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<Response>('transactions');
      const {
        transactions: transactionsResponse,
        balance: balanceResponse,
      } = response.data;

      const transactionsFormatted = transactionsResponse.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedValue: formatValue(transaction.value),
          formattedDate: formatDate(transaction.created_at),
        }),
      );

      const balanceFormatted = {
        income: formatValue(Number(balanceResponse.income)),
        outcome: formatValue(Number(balanceResponse.outcome)),
        total: formatValue(Number(balanceResponse.total)),
      };

      setTransactions(transactionsFormatted);
      setBalance(balanceFormatted);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        {transactions.length > 0 ? (
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.type === 'outcome' && ' - '}
                      {transaction.formattedValue}
                    </td>
                    <td>
                      {(transaction.category.title === 'Salario' ||
                        transaction.category.title === 'Venda') && (
                        <img src={totalCategory} alt="Total" width="16" />
                      )}
                      {transaction.category.title === 'Moradia' && <FiHome />}
                      {transaction.category.title === 'Comida' && (
                        <GiHamburger />
                      )}
                      {transaction.category.title === 'Transporte' && (
                        <RiBikeLine />
                      )}
                      {transaction.category.title}
                    </td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        ) : (
          <h3 className="title">Não há nenhuma transação cadastrada.</h3>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
