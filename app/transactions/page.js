'use client'
import { useState, useEffect } from 'react';
import {FiTrash, FiEye, FiEdit, FiX, FiPlus} from "react-icons/fi";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [modalToggle, setModalToggle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        transactionID: '',
        buyerID: '',
        sellerID: '',
        listingID: '',
        transactionDate: ''
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/api/transactions');
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const { data } = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, []);

    const handleDelete = async (transactionID) => {
    try {
        console.log('Deleting transaction with ID:', transactionID);
        let requestJson = {
                transaction_id: transactionID
        }
        const response = await fetch(`/api/transactions`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(requestJson)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete transaction');
        }

        console.log('Transaction deleted successfully');
        setTransactions(transactions.filter(transaction => transaction.transaction_id !== transactionID));
    } catch (error) {
        console.error('Error deleting listing:', error);
    }
};

    const handleEdit = (transaction) => {
        setFormData({
            transactionID: transaction.transaction_id,
            buyerID: transaction.buyer_id,
            sellerID: transaction.seller_id,
            listingID: transaction.listing_id,
            transactionDate: transaction.transaction_date,
        });
        setIsEditing(true);
        setModalToggle(true);
    };

    const handleAdd = () => {
        setFormData({
            transactionID: '',
            buyerID: '',
            sellerID: '',
            listingID: '',
            transactionDate: '',
        });
        setIsAdding(true);
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

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/transactions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update transaction');
            }
            const updatedTransaction = await response.json();
            setTransactions((prevTransactions) => {
                return prevTransactions.map(transaction => {
                    if(transaction.transaction_id === updatedTransaction.transaction_id){
                        return updatedTransaction
                    }
                    return transaction
                })
            })
            /*setTransactions(transactions.map(transaction =>
                transaction.transactionID === formData.transactionID ? updatedTransaction : transaction
            ));*/
            setModalToggle(false);
        } catch (error) {
            console.error('Error updating listing:', error);
        }
    };

    const handleSaveAdd = async (e) => {
        e.preventDefault();
        setModalToggle(false)
        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buyerID: formData.buyerID,
                    sellerID: formData.sellerID,
                    listingID: formData.listingID,
                    transactionDate: formData.transactionDate,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }
            const newTransaction = await response.json();
            setTransactions((prevData) => [...prevData, newTransaction[0]]);
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
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
                    {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
                </h2>
                <form onSubmit={isEditing ? handleSaveEdit : handleSaveAdd}>
                    <label className="block text-sm font-medium text-gray-700">
                        Buyer ID
                        <input
                            type="text"
                            name="buyerID"
                            value={formData.buyerID}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                        Seller ID
                        <input
                            type="text"
                            name="sellerID"
                            value={formData.sellerID}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
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
                        {isEditing ? 'Save Changes' : 'Add Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="flex justify-center mt-8">
            <div className="overflow-x-auto w-full max-w-4xl">
                <div className='flex flex-row'>
                    <h3>Transactions</h3>
                    <button
                        className="px-2 py-1 mx-1 text-white rounded hover:bg-green-600"
                        onClick={handleAdd}
                        title="Add"
                    >
                        <FiPlus/>
                    </button>
                </div>
                <table className="min-w-full table-auto text-sm">
                    <thead>
                    <tr className="bg-gray-300 text-black">
                        <th className="px-4 py-2 text-left">Transaction ID</th>
                        <th className="px-4 py-2 text-left">Buyer ID</th>
                        <th className="px-4 py-2 text-left">Seller ID</th>
                        <th className="px-4 py-2 text-left">Listing ID</th>
                        <th className="px-4 py-2 text-left">Transaction Date</th>
                        <th className="px-4 py-2 text-left"></th>
                        <th className="px-4 py-2 text-left"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.transaction_id} className="border-b">
                            <td className="px-4 py-2">{transaction.transaction_id}</td>
                            <td className="px-4 py-2">{transaction.buyer_id}</td>
                            <td className="px-4 py-2">{transaction.seller_id}</td>
                            <td className="px-4 py-2">{transaction.listing_id}</td>
                            <td className="px-4 py-2">{transaction.transaction_date
                                ? new Date(transaction.transaction_date).toLocaleDateString()
                                : 'N/A'} </td>
                            <td>
                                <button
                                    className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                                    onClick={() => handleEdit(transaction)}
                                    title="Edit"
                                >
                                    <FiEdit/>
                                </button>
                            </td>
                            <td>
                                <button
                                    className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                                    onClick={() => handleDelete(transaction.transaction_id)}
                                    title="Delete"
                                >
                                    <FiTrash/>
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