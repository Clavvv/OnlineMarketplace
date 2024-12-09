'use client'
import { useState, useEffect } from 'react'
import { FiPlus, FiEdit, FiTrash, FiX } from "react-icons/fi"

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
    numActiveListings: '',
  });


  useEffect(() => {
    const getData = async () => {
      fetch('/api/users')
        .then((response) => response.json())
        .then((jsonData) => {
          setUsers(jsonData);
        })
        .catch((error) => console.error('Failed to load users: ', error));
    }
    getData();

  }, []);

  const handleDelete = async (userID) => {
    const response = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({userId: userID})
    })

    //resonse returns 200 but no data so if everything went well we just delete the userId that we sent
    if (!response.ok){
      throw new Error('failed to delete user oopsie...')
    } else {
      setUsers(users.filter(user => user.userId !== userID))
    }




  };

  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
    setModalToggle(true);
  };

  const handleAdd = () => {
    // unsure what the point of maxID is
    const maxID =
      users.reduce((max, user) => Math.max(max, parseInt(user.userID, 10)), 0);

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
    /*DO NOT SET STATE ONCE THAN ONCE IN THE SAME FUNCTION, 
    THIS IS WHERE THE ISSUE WHERE EVERYTHING BECOMES THE NEW ELEMENT IN THE TABLE COMES FROM
    */

    e.preventDefault();
    setModalToggle(false);

    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })

    const updatedUser = await response.json()

    setUsers((prevUsers) => {
      return prevUsers.map(user => {
        if(user.userId === updatedUser.userId){
          return updatedUser
        }
        return user
      })
    })

  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    setModalToggle(false);

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error('failed to save the user try again later...')

    }

    const parsedData = await response.json()
    const newUser= parsedData[0]
    setUsers((prevData) => [...prevData, newUser])
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
        {/* Unlike products which changes the value of the formData field mode to reflect the operation this calls handleSaveEdit or handleSaveAdd depending on the 
              state of isEditing. We will just wrap the submission to the database inside these functions
               */}
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
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
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
    <div className="flex justify-center h-full mt-8">
      <div className="overflow-x-auto w-full max-w-4xl">
        <div className='flex flex-row'>
          <h3>Users</h3>
          <button
            className="px-2 py-1 mx-1 text-white rounded hover:bg-green-600"
            onClick={handleAdd}
            title="Add"
          >
            <FiPlus />
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
              <th className="px-4 py-2 text-left">Edit</th>
              <th className="px-4 py-2 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{user.userId}</td>
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
                    <FiEdit />
                  </button>
                </td>
                <td>
                  <button
                    className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(user.userId)}
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
      {modalToggle && userModal}
    </div>
  );
}
