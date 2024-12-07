'use client'
import { useState, useEffect } from 'react'
import {FiPlus, FiEdit, FiTrash, FiX} from "react-icons/fi"

export default function Users() {

    const [users, setUsers] = useState([]);
    const [modalToggle, setModalToggle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      feedbackScore: '',
      numItemsSold: '',
      numActiveListings: ''
  });


  useEffect(() => {
        const getData = async () => {
            await fetch('/users_sample.json')
                .then((response) => response.json())
                .then((jsonData) => {
                    setUsers(jsonData);
                })
                .catch((error) => console.error('Failed to load users: ', error));
        }
        getData();
    }, []);

  const handleDelete = (userID) => {
        setUsers(users.filter(user => user.userID !== userID));
    };

    const handleEdit = (user) => {
        setFormData(user);
        setIsEditing(true);
        setModalToggle(true);
    };

    const handleAdd = () => {
      const maxID =
          users.reduce((max, user) => Math.max(max, parseInt(user.userID, 10)), 0);

      setFormData({
        userID: String(maxID + 1),
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        feedbackScore: '',
        numItemsSold: '',
        numActiveListings: ''
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

    const handleSaveEdit = (e) => {
        e.preventDefault();
        setUsers(users.map(user =>
            user.listingID === formData.userID ? formData : user
        ));
        setModalToggle(false);
    };

    const handleSaveAdd = (e) => {
        e.preventDefault();
        setUsers([...users, formData]);
        setModalToggle(false);
    };


  const userModal = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <button
                    className="flex w-full justify-end text-gray-500 hover:text-gray-700"
                    onClick={() => setModalToggle(false)}
                >
                    <FiX />
                </button>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                    {isEditing ? 'Edit User' : 'Add New User'}
                </h2>
              <form onSubmit={isEditing ? handleSaveEdit : handleSaveAdd}>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                  <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Last Name
                  <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Email
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Phone Number
                  <input
                      type="tel"
                      id="phone"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Feedback Score
                  <input
                      type="number"
                      name="feedbackScore"
                      value={formData.feedbackScore}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Number of Items Sold
                  <input
                      type="number"
                      name="numItemsSold"
                      value={formData.numItemsSold}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Number of Active Listings
                  <input
                      type="number"
                      name="numActiveListings"
                      value={formData.numActiveListings}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      required
                  />
                </label>
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  {isEditing ? 'Save Changes' : 'Add User'}
                </button>
              </form>
            </div>
        </div>
  );


  return (
      <div className="flex justify-center">
        <div className="overflow-x-auto w-full max-w-4xl">
          <div className='flex flex-row'>
            <h3>Users</h3>
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
                      <th className="px-4 py-2 text-left">User ID</th>
                      <th className="px-4 py-2 text-left">First Name</th>
                      <th className="px-4 py-2 text-left">Last Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Phone Number</th>
                      <th className="px-4 py-2 text-left">Feedback Score</th>
                      <th className="px-4 py-2 text-left">Number of Items Sold</th>
                      <th className="px-4 py-2 text-left">Number of Active Listings</th>
                      <th className="px-4 py-2 text-left"></th>
                      <th className="px-4 py-2 text-left"></th>
                    </tr>
                    </thead>
                  <tbody>
                    {users.map((user) => (
                        <tr key={user.userID} className="border-b">
                            <td className="px-4 py-2">{user.userID}</td>
                            <td className="px-4 py-2">{user.firstName}</td>
                            <td className="px-4 py-2">{user.lastName}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-1 py-2">{user.phoneNumber}</td>
                            <td className="px-4 py-2">{user.feedbackScore}</td>
                            <td className="px-4 py-2">{user.numItemsSold}</td>
                            <td className="px-4 py-2">{user.numActiveListings}</td>
                            <td>
                                <button
                                    className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                                    onClick={() => handleEdit(user)}
                                    title="Edit"
                                >
                                    <FiEdit/>
                                </button>
                            </td>
                            <td>
                                <button
                                    className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                                    onClick={() => handleDelete(user.userID)}
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
            {modalToggle && userModal}
        </div>
    );
}
