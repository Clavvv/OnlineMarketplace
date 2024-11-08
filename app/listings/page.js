'use client'
import { useState, useEffect } from 'react';
import { FiTrash, FiEye, FiEdit, FiX } from "react-icons/fi";

export default function Listings() {
    const [listings, setListings] = useState([]);
    const [modalToggle, setModalToggle] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        listingID: '',
        productID: '',
        userID: '',
        listingPrice: '',
        status: '',
        condition: ''
    });

    useEffect(() => {
        const getData = async () => {
            await fetch('/listings_sample.json')
                .then((response) => response.json())
                .then((jsonData) => {
                    setListings(jsonData);
                })
                .catch((error) => console.error('Failed to load listings: ', error));
        }
        getData();
    }, []);

    const handleDelete = (listingID) => {
        setListings(listings.filter(listing => listing.listingID !== listingID));
    };

    const handleEdit = (listing) => {
        setFormData(listing);
        setIsEditing(true);
        setModalToggle(true);
    };

    const handleView = (listing) => {
        setSelectedListing(listing);
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
        setListings(listings.map(listing => 
            listing.listingID === formData.listingID ? formData : listing
        ));
        setModalToggle(false);
    };

    const listingModal = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <button
                    className="flex w-full justify-end text-gray-500 hover:text-gray-700"
                    onClick={() => setModalToggle(false)}
                >
                    <FiX />
                </button>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                    {isEditing ? 'Edit Listing' : 'Listing Details'}
                </h2>
                {isEditing ? (
                    <form onSubmit={handleSaveEdit}>
                        <label className="block text-sm font-medium text-gray-700">
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
                        <label className="block text-sm font-medium text-gray-700 mt-4">
                            User ID
                            <input
                                type="text"
                                name="userID"
                                value={formData.userID}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700 mt-4">
                            Listing Price
                            <input
                                type="number"
                                name="listingPrice"
                                value={formData.listingPrice}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700 mt-4">
                            Status
                            <input
                                type="text"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </label>
                        <label className="block text-sm font-medium text-gray-700 mt-4">
                            Condition
                            <input
                                type="text"
                                name="condition"
                                value={formData.condition}
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
                        {selectedListing && (
                            <>
                                <p><strong>Listing ID:</strong> {selectedListing.listingID}</p>
                                <p><strong>Product ID:</strong> {selectedListing.productID}</p>
                                <p><strong>User ID:</strong> {selectedListing.userID}</p>
                                <p><strong>Listing Price:</strong> ${selectedListing.listingPrice}</p>
                                <p><strong>Status:</strong> {selectedListing.status}</p>
                                <p><strong>Condition:</strong> {selectedListing.condition}</p>
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
                <h3>Listings</h3>
                <table className="min-w-full table-auto text-sm">
                    <thead>
                        <tr className="bg-gray-300 text-black">
                            <th className="px-4 py-2 text-left">Listing ID</th>
                            <th className="px-4 py-2 text-left">Product ID</th>
                            <th className="px-4 py-2 text-left">User ID</th>
                            <th className="px-4 py-2 text-left">Listing Price</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Condition</th>
                            <th className="px-4 py-2 text-left"></th>
                            <th className="px-4 py-2 text-left"></th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((listing) => (
                            <tr key={listing.listingID} className="border-b">
                                <td className="px-4 py-2">{listing.listingID}</td>
                                <td className="px-4 py-2">{listing.productID}</td>
                                <td className="px-4 py-2">{listing.userID}</td>
                                <td className="px-4 py-2">${listing.listingPrice}</td>
                                <td className="px-4 py-2">{listing.status}</td>
                                <td className="px-4 py-2">{listing.condition}</td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleView(listing)}
                                        title="View"
                                    >
                                        <FiEye />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                                        onClick={() => handleEdit(listing)}
                                        title="Edit"
                                    >
                                        <FiEdit />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(listing.listingID)}
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
            {modalToggle && listingModal}
        </div>
    );
}