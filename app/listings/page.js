'use client'
import { useState, useEffect } from 'react';
import {FiTrash, FiEdit, FiX, FiPlus} from "react-icons/fi";

export default function Listings() {
    const [listings, setListings] = useState([]);
    const [modalToggle, setModalToggle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        listingID: '',
        productID: '',
        userID: '',
        listingPrice: '',
        status: '',
        condition: ''
    });

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('/api/listings');
                if (!response.ok) {
                    throw new Error('Failed to fetch listings');
                }
                const { data } = await response.json();
                setListings(data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };
        fetchListings();
    }, []);

    const handleDelete = (listingID) => {

        let requestJson = {
            listing_id: listingID
        };
    
        fetch('/api/listings', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(requestJson)
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Failed to delete listing')
                    })
                }
                return response.json()
            })
            .then(() => {
                console.log('Listing deleted successfully');
                setListings(prevListings => prevListings.filter(listing => listing.listing_id !== listingID));
            })
            .catch((error) => {
                console.error('Error deleting listing:', error);
            })
    }

    const handleEdit = (listing) => {
        setFormData({
            listingID: listing.listing_id,
            productID: listing.product_id,
            userID: listing.user_id,
            listingPrice: listing.listing_price,
            status: listing.status,
            condition: listing.item_condition,
        });
        setIsEditing(true);
        setModalToggle(true);
    };

    const handleAdd = () => {
        setFormData({
            listingID: '',
            productID: '',
            userID: '',
            listingPrice: '',
            status: '',
            condition: ''
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

    const handleSaveEdit =async  (e) => {
        e.preventDefault();
    
        const response = await fetch('/api/listings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Failed to update listing');
                    });
                }
                return response.json();
            })
            .then((updatedListing) => {
                console.log('updated listings: ', updatedListing)
                setListings(prevListings => {
                    return prevListings.map(listing => {
                        if (listing.listing_id === updatedListing.listing_id) {
                            return updatedListing
                        }

                        return listing
                    })
                })
                setModalToggle(false);
            })
            .catch((error) => {
                console.error('Error updating listing:', error);
            })
    }

    const handleSaveAdd = async (e) => {
        e.preventDefault()
        setModalToggle(false);
    
        fetch('/api/listings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productID: formData.productID,
                userID: formData.userID,
                listingPrice: formData.listingPrice,
                status: formData.status,
                condition: formData.condition,
            }),
        }).then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Failed to add listing');
                    })
                }
                return response.json(); //returns new listing from the database
            }).then((newListing) => {
                setListings(prevListings => {
                    const updatedListings = [...prevListings, newListing[0]]
                    return updatedListings
                })

            })
            .catch((error) => {
                console.error('Error adding listing:', error);
            })
    }

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
                    {isEditing ? 'Edit Listing' : 'Add New Listing'}
                </h2>
                <form onSubmit={isEditing ? handleSaveEdit : handleSaveAdd}>
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
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="sold">Sold</option>
                            <option value="pending">Pending</option>
                        </select>
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mt-4">
                        Condition
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="" disabled>Select Condition</option>
                            <option value="new">New</option>
                            <option value="like new">Like New</option>
                            <option value="used">Used</option>
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {isEditing ? 'Save Changes' : 'Add Listing'}
                    </button>
                </form>
            </div>
        </div>
    );


    return (
        <div className="flex justify-center">
            <div className="overflow-x-auto w-full max-w-4xl">
                <div className='flex flex-row'>
                    <h3>Listings</h3>
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
                            <th className="px-4 py-2 text-left">Listing ID</th>
                            <th className="px-4 py-2 text-left">Product ID</th>
                            <th className="px-4 py-2 text-left">User ID</th>
                            <th className="px-4 py-2 text-left">Listing Price</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Condition</th>
                            <th className="px-4 py-2 text-left"></th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {listings.map((listing) => (
                            <tr key={listing.listing_id} className="border-b">
                                <td className="px-4 py-2">{listing.listing_id}</td>
                                <td className="px-4 py-2">{listing.product_id}</td>
                                <td className="px-4 py-2">{listing.user_id}</td>
                                <td className="px-4 py-2">${listing.listing_price}</td>
                                <td className="px-4 py-2">{listing.status}</td>
                                <td className="px-4 py-2">{listing.item_condition}</td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                                        onClick={() => handleEdit(listing)}
                                        title="Edit"
                                    >
                                        <FiEdit/>
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(listing.listing_id)}
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
                {modalToggle && listingModal}
        </div>
    );
}