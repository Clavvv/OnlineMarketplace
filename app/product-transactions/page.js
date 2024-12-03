'use client'
import { useState, useEffect } from 'react';
import {FiTrash, FiEye, FiEdit, FiX, FiPlus} from "react-icons/fi";

export default function ProductsTransactions() {
    const [pt, setPT] = useState([]);
    const [modalToggle, setModalToggle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        productsTransactionsID: '',
        transactionID: '',
        productID: ''
    });

    useEffect(() => {
        const fetchPT = async () => {
            try {
                const response = await fetch('/api/product_transactions');
                if (!response.ok) {
                    throw new Error('Failed to fetch entries');
                }
                const { data } = await response.json();
                setPT(data);
            } catch (error) {
                console.error('Error fetching entries:', error);
            }
        };
        fetchPT();
    }, []);

    const handleDelete = async (ptID) => {
    try {
        console.log('Deleting entry with ID:', ptID);
        let requestJson = {
                pt_id: ptID
        }
        const response = await fetch(`/api/product_transactions`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(requestJson)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete entry');
        }

        console.log('Entry deleted successfully');
        setPT(pt.filter(productTransaction => productTransaction.pt_id !== ptID));
    } catch (error) {
        console.error('Error deleting entry:', error);
    }
};

    const handleEdit = (pt) => {
        setFormData({
            productsTransactionsID: pt.product_transaction_id,
            transactionID: pt.transaction_id,
            productID: pt.product_id
        });
        setIsEditing(true);
        setModalToggle(true);
    };

    const handleAdd = () => {
        setFormData({
            productsTransactionsID: '',
            transactionID: '',
            productID: ''
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
            const response = await fetch(`/api/product_transactions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update entry');
            }
            const updatedPT = await response.json();
            setPT(pt.map(productTransaction =>
                productTransaction.productsTransactionsID === formData.productsTransactionsID
                    ? updatedPT : productTransaction
            ));
            setModalToggle(false);
        } catch (error) {
            console.error('Error updating listing:', error);
        }
    };

    const handleSaveAdd = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/product_transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productsTransactionsID: formData.productsTransactionsID,
                    transactionID: formData.transactionID,
                    productID: formData.productID,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add entry');
            }
            const newPT = await response.json();
            setPT([...pt, newPT]); // The new listing includes the generated listingID
            setModalToggle(false);
        } catch (error) {
            console.error('Error adding listing:', error);
        }
};

    const productTransactionModal = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <button
                    className="flex w-full justify-end text-gray-500 hover:text-gray-700"
                    onClick={() => setModalToggle(false)}
                >
                    <FiX />
                </button>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                    {isEditing ? 'Edit Product Transaction' : 'Product Transaction Details'}
                </h2>
                <form onSubmit={isEditing ? handleSaveEdit : handleSaveAdd}>
                    <label className="block text-sm font-medium text-gray-700">
                        Transaction ID
                        <input
                            type="text"
                            name="transactionID"
                            value={formData.transactionID}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mt-4">
                        Product ID
                        <input
                            type="text"
                            name="productID"
                            value={formData.productID}
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
        <div className="flex justify-center">
            <div className="overflow-x-auto w-full max-w-4xl">
                <div className='flex flex-row'>
                    <h3>Product Transactions</h3>
                    <button
                        className="px-2 py-1 mx-1 text-white rounded hover:bg-green-600"
                        onClick={handleAdd}
                        title="Add"
                    >
                        <FiPlus/>
                    </button>
                    <div className="bg-gray-100 text-red-500">**REFRESH PAGE AFTER TABLE CHANGE FOR NOW**</div>
                </div>
                <table className="min-w-full table-auto text-sm">
                <thead>
                        <tr className="bg-gray-300 text-black">
                            <th className="px-4 py-2 text-left">Products-Transactions ID</th>
                            <th className="px-4 py-2 text-left">Transaction ID</th>
                            <th className="px-4 py-2 text-left">Product ID</th>
                            <th className="px-4 py-2 text-left"></th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {pt.map((pt) => (
                            <tr key={pt.product_transaction_id} className="border-b">
                                <td className="px-4 py-2">{pt.product_transaction_id}</td>
                                <td className="px-4 py-2">{pt.transaction_id}</td>
                                <td className="px-4 py-2">{pt.product_id}</td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                                        onClick={() => handleEdit(pt)}
                                        title="Edit"
                                    >
                                        <FiEdit/>
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(pt.product_transaction_id)}
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
                {modalToggle && productTransactionModal}
            </div>
            );
            }