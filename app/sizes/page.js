'use client'
import {useState, useEffect} from 'react';
import { FiPlus, FiEdit, FiTrash, FiX } from "react-icons/fi"

export default function Sizes() {

    const [sizes, setSizes] = useState([])
    const [modalToggle, setModalToggle] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({
        sizeID: '',
        size: '',
        categoryID: '',
        categoryName: '',
        mode: ''
    })


    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await fetch('/api/sizes');
                if (!response.ok) {
                    throw new Error('Failed to fetch sizes');
                }
                const { data } = await response.json();
                setSizes(data);
            } catch (error) {
                console.error('Error fetching sizes:', error);
            }
        };
        fetchSizes();
    }, []);


    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleDelete = async (sizeID) => {

        try {
            let requestJson = {
                size_id: sizeID
            };

            fetch('/api/sizes', {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(requestJson)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.error || 'Failed to delete size')
                        })
                    }
                    return response.json()
                })
                .then(() => {
                    console.log('Size deleted successfully');
                    return setSizes(prevSizes => {
                        return prevSizes.filter(size =>
                            size.size_id !== sizeID
                        );
                    });
                })
        } catch (error) {
            console.error('Error deleting size:', error);
        }
    }

    const handleEdit = (size) => {
        setFormData({
            sizeID: size.size_id,
            size: size.size,
            categoryID: size.category_id
        });
        setIsEditing(true);
        setModalToggle(true);
    };

    const handleAdd = () => {
        setFormData({
            sizeID: '',
            size: '',
            categoryID: '',
        });
        setIsAdding(true);
        setIsEditing(false);
        setModalToggle(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/sizes', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Failed to update size');
                    });
                }
                return response.json();
            })
            .then((updatedSize) => {
                console.log('updated size: ', updatedSize)
                setSizes(prevSizes => {
                    return prevSizes.map(size => {
                        console.log(size)
                        if (size.size_id === updatedSize.size_id) {
                            return updatedSize
                        }
                        return size
                    })
                })
                setModalToggle(false);
            })
            .catch((error) => {
                console.error('Error updating size:', error);
            })
    }

    const handleSaveAdd = async (e) => {
        e.preventDefault()
        setModalToggle(false);

        fetch('/api/sizes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                size: formData.size,
                categoryID: formData.categoryID
            }),
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Failed to add size');
                })
            }
            return response.json(); //returns new listing from the database
        }).then((newSize) => {
            setSizes(prevSizes => {
                const updatedSizes = [...prevSizes, newSize[0]]
                return updatedSizes
            })

        })
            .catch((error) => {
                console.error('Error adding size:', error);
            })
    }

    const newSizeModal = <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
                className="flex w-full justify-end text-gray-500 hover:text-gray-700"
                onClick={(e) => setModalToggle('')}
            >
                <FiX />
            </button>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                {isEditing ? 'Edit Size' : 'Add New Size'}
            </h2>
            <form onSubmit={isEditing ? handleSaveEdit : handleSaveAdd}>
                <div className="mb-4">
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                        Size
                    </label>
                    <select
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    >
                        <option value='' disabled>choose an option</option>
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                    </select>
                </div>
                                <div className="mb-4">
                    <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="categoryName"
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    >
                        {/*TODO*/}
                        <option value='' disabled>choose an option</option>
                        <option value="Shirts">Shirts</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Pants">Pants</option>
                    </select>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {isEditing ? 'Save Changes' : 'Add Size'}
                    </button>
                </div>
            </form>

        </div>
    </div>

    return (
        <div className="flex justify-center mt-8">
        <div className="overflow-x-auto w-full max-w-4xl">
        <div className = 'flex flex-row'>
            <h3>Add Sizing</h3>
            <button
                    className="px-2 py-1 mx-1 text-white rounded hover:bg-green-600"
                    onClick={(e) => setModalToggle(true)}
                    title="Add"
                  >
                    <FiPlus />
            </button>
        </div>
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-300 text-black">
                <th className="px-4 py-2 text-left">Size ID</th>
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-left">Category ID</th>
                <th className="px-4 py-2 text-left">Edit</th>
                <th className="px-4 py-2 text-left">Delete</th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size.size_id} className="border-b">
                  <td className="px-4 py-2">{size.size_id}</td>
                  <td className="px-4 py-2">{size.size}</td>
                  <td className="px-4 py-2">{size.category_id}</td>
                  <td>
                  <button
                    className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(size)}
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  </td>
                  <td>
                  <button
                    className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(size.size_id)}
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
        {modalToggle && newSizeModal}
      </div>
    )
}