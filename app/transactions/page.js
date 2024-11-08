'use client'
import { useState, useEffect } from 'react';
import { FiTrash, FiEye, FiEdit, FiX } from "react-icons/fi";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [modalToggle, setModalToggle] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        transactionID: '',
        listingID: '',
        amount: '',
        transactionDate: ''
    });

    useEffect(() => {
        const getData = async () => {
            await fetch('/transactions_sample.json')
                .then((response) => response.json())
                .then((jsonData) => {
                    setTransactions(jsonData);
                })
                .catch((error) => console.error('Failed to load transactions: ', error));
        }
        getData();
    }, []);

    const handleDelete = (transactionID) => {
        setTransactions(transactions.filter(transaction => transaction.transactionID !== transactionID));
    };

    const handleEdit = (transaction) => {
        setFormData(transaction);
        setIsEditing(true);
        setModalToggle(true);
    };

    const handleView = (transaction) => {
        setSelectedTransaction(transaction);
        setIsEditing(false);
        setModalToggle(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        setTransactions(transactions.map(transaction => 
            transaction.transactionID === formData.transactionID ? formData : transaction
        ));
        setModalToggle(false);
    };

    const transactionModal = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <button
                    className="flex w-full justify-end text-gray-500 hover:text-gray-700"
                    onClick={() => setModalToggle(false)}
                >
                    <FiX />
                </button>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                    {isEditing ? 'Edit Transaction' : 'Transaction Details'}
                </h2>
                {isEditing ? (
                    <form onSubmit={handleSaveEdit}>
                        <label className="block text-sm font-medium text-gray-700">
                            Listing ID
                            <input
                                type="text"
                                name="listingID"
                                value={formData.listingID}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700 mt-4">
                            Amount
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700 mt-4">
                            Transaction Date
                            <input
                                type="date"
                                name="transactionDate"
                                value={formData.transactionDate}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div>
                        {selectedTransaction && (
                            <>
                                <p><strong>Transaction ID:</strong> {selectedTransaction.transactionID}</p>
                                <p><strong>Listing ID:</strong> {selectedTransaction.listingID}</p>
                                <p><strong>Amount:</strong> ${selectedTransaction.amount}</p>
                                <p><strong>Transaction Date:</strong> {selectedTransaction.transactionDate}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex justify-center">
            <div className="overflow-x-auto w-full max-w-4xl">
                <h3>Transactions</h3>
                <table className="min-w-full table-auto text-sm">
                    <thead>
                        <tr className="bg-gray-300 text-black">
                            <th className="px-4 py-2 text-left">Transaction ID</th>
                            <th className="px-4 py-2 text-left">Listing ID</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Transaction Date</th>
                            <th className="px-4 py-2 text-left"></th>
                            <th className="px-4 py-2 text-left"></th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.transactionID} className="border-b">
                                <td className="px-4 py-2">{transaction.transactionID}</td>
                                <td className="px-4 py-2">{transaction.listingID}</td>
                                <td className="px-4 py-2">${transaction.amount}</td>
                                <td className="px-4 py-2">{transaction.transactionDate}</td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleView(transaction)}
                                        title="View"
                                    >
                                        <FiEye />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                                        onClick={() => handleEdit(transaction)}
                                        title="Edit"
                                    >
                                        <FiEdit />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(transaction.transactionID)}
                                        title="Delete"
                                    >
                                        <FiTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modalToggle && transactionModal}
        </div>
    );
}