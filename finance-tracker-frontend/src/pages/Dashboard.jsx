import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Wallet
} from "lucide-react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "EXPENSE",
    category: "",
    date: "",
  });

  useEffect(() => {
    fetchDashboard();
    fetchTransactions();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get(
        `/transactions/dashboard/${userId}`
      );
      setSummary(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get(
        `/transactions/${userId}`
      );
      setTransactions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addTransaction = async (e) => {
    e.preventDefault();

    try {
      await api.post("/transactions", {
        ...form,
        userId: Number(userId),
      });

      setForm({
        title: "",
        amount: "",
        type: "EXPENSE",
        category: "",
        date: "",
      });

      fetchDashboard();
      fetchTransactions();
    } catch (error) {
      console.log(error);
      alert("Failed to add transaction");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchDashboard();
      fetchTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const chartData = [
    {
      name: "Income",
      value: summary.income,
    },
    {
      name: "Expense",
      value: summary.expense,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Personal Finance Tracker
            </h1>

            <p className="text-slate-500 mt-1">
              Track your income and expenses
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow"
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 mb-2">
            <TrendingUp
              size={32}
              className="text-green-600"
            />
              Total Income
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              ₹{summary.income}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 mb-2">
            <TrendingDown
              size={32}
              className="text-red-600"
            />
              Total Expense
            </p>

            <h2 className="text-3xl font-bold text-red-600">
              ₹{summary.expense}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 mb-2">
            <Wallet
              size={32}
              className="text-blue-600"
            />
              Current Balance
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              ₹{summary.balance}
            </h2>
          </div>

        </div>

        {/* Form + Chart */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* Form */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-5">
              Add Transaction
            </h2>

            <form
              onSubmit={addTransaction}
              className="space-y-4"
            >
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="EXPENSE">
                  Expense
                </option>

                <option value="INCOME">
                  Income
                </option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
              >
                Add Transaction
              </button>
            </form>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-5">
              Expense Overview
            </h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={110}
                    label
                  >
                    {chartData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[index]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-5">
            Transactions
          </h2>

          {transactions.length === 0 ? (
            <p className="text-slate-500">
              No transactions added yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="p-3">
                      Title
                    </th>

                    <th className="p-3">
                      Amount
                    </th>

                    <th className="p-3">
                      Type
                    </th>

                    <th className="p-3">
                      Category
                    </th>

                    <th className="p-3">
                      Date
                    </th>

                    <th className="p-3">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b"
                      >
                        <td className="p-3">
                          {transaction.title}
                        </td>

                        <td className="p-3">
                          ₹{transaction.amount}
                        </td>

                        <td className="p-3">
                          <span
                            className={
                              transaction.type ===
                              "INCOME"
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {transaction.type}
                          </span>
                        </td>

                        <td className="p-3">
                          {transaction.category}
                        </td>

                        <td className="p-3">
                          {transaction.date}
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() =>
                              deleteTransaction(
                                transaction.id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
