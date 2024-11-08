'use client'
import { useState, useEffect } from 'react';
import { FiTrash, FiEye, FiEdit, FiX } from "react-icons/fi";

export default function ProductsTransactions() {
    const [productsTransactions, setProductsTransactions] = useState([]);
    const [modalToggle, setModalToggle] = useState(false);
    const [selectedProductTransaction, setSelectedProductTransaction] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        productsTransactionsID: '',
        transactionID: '',
        productID: ''
    });

    useEffect(() => {
        const getData = async () => {
            await fetch('/product_transactions_sample.json')
                .then((response) => response.json())
                .then((jsonData) => {
                    setProductsTransactions(jsonData);
                })
                .catch((error) => console.error('Failed to load products transactions: ', error));
        }
        getData();
    }, []);

    const handleDelete = (productsTransactionsID) => {
        setProductsTransactions(productsTransactions.filter(pt => pt.productsTransactionsID !== productsTransactionsID));
    };

    const handleEdit = (productTransaction) => {
        setFormData(productTransaction);
        setIsEditing(true);
        setModalToggle(true);
    };

    const handleView = (productTransaction) => {
        setSelectedProductTransaction(productTransaction);
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
        setProductsTransactions(productsTransactions.map(pt => 
            pt.productsTransactionsID === formData.productsTransactionsID ? formData : pt
        ));
        setModalToggle(false);
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
                {isEditing ? (
                    <form onSubmit={handleSaveEdit}>
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
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div>
                        {selectedProductTransaction && (
                            <>
                                <p><strong>Products Transactions ID:</strong> {selectedProductTransaction.productsTransactionsID}</p>
                                <p><strong>Transaction ID:</strong> {selectedProductTransaction.transactionID}</p>
                                <p><strong>Product ID:</strong> {selectedProductTransaction.productID}</p>
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
                <h3>Product Transactions</h3>
                <table className="min-w-full table-auto text-sm">
                    <thead>
                        <tr className="bg-gray-300 text-black">
                            <th className="px-4 py-2 text-left">Products Transactions ID</th>
                            <th className="px-4 py-2 text-left">Transaction ID</th>
                            <th className="px-4 py-2 text-left">Product ID</th>
                            <th className="px-4 py-2 text-left"></th>
                            <th className="px-4 py-2 text-left"></th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsTransactions.map((pt) => (
                            <tr key={pt.productsTransactionsID} className="border-b">
                                <td className="px-4 py-2">{pt.productsTransactionsID}</td>
                                <td className="px-4 py-2">{pt.transactionID}</td>
                                <td className="px-4 py-2">{pt.productID}</td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleView(pt)}
                                        title="View"
                                    >
                                        <FiEye />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                                        onClick={() => handleEdit(pt)}
                                        title="Edit"
                                    >
                                        <FiEdit />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(pt.productsTransactionsID)}
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
            {modalToggle && productTransactionModal}
        </div>
    );
}