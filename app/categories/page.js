'use client'
import {useEffect, useState} from 'react';
import {FiEdit, FiPlus, FiTrash, FiX} from "react-icons/fi"

export default function Categories() {

    const [categories, setCategories] = useState([])
    const [modalToggle, setModalToggle] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [formData, setFormData] = useState({
        categoryID: '',
        categoryName: '',
        demographic: ''
    })


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const { data } = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);


    const handleDelete = async (categoryID) => {
    try {
        let requestJson = {
            category_id: categoryID
        };

        fetch('/api/categories', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(requestJson)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Failed to delete category')
                    })
                }
                return response.json()
            })
            .then(() => {
                console.log('Category deleted successfully');
                return setCategories(prevCategories => {
                    return prevCategories.filter(category =>
                        category.category_ID !== categoryID
                    );
                });
            })
    } catch(error) {
            console.error('Error deleting category:', error);
        }
    }

    const handleEdit = (category) => {
        setFormData({
            categoryID: category.category_id,
            categoryName: category.category_name,
            demographic: category.demographic,
        });
        setIsEditing(true);
        setModalToggle(true);
    };

    const handleAdd = () => {
        setFormData({
            categoryID: '',
            categoryName: '',
            demographic: '',
        });
        setIsAdding(true);
        setIsEditing(false);
        setModalToggle(true);
    };

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSaveEdit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/categories', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Failed to update category');
                    });
                }
                return response.json();
            })
            .then((updatedCategory) => {
                console.log('updated category: ', updatedCategory)
                setCategories(prevCategories => {
                    return prevCategories.map(category => {
                        console.log(category)
                        if (category.category_id === updatedCategory.category_id) {
                            return updatedCategory
                        }
                        return category
                    })
                })
                setModalToggle(false);
            })
            .catch((error) => {
                console.error('Error updating category:', error);
            })
    }

    const handleSaveAdd = async (e) => {
        e.preventDefault()
        setModalToggle(false);

        fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                categoryName: formData.categoryName,
                demographic: formData.demographic
            }),
        }).then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Failed to add category');
                    })
                }
                return response.json(); //returns new listing from the database
            }).then((newCategory) => {
                setCategories(prevCategories => {
                    const updatedCategories = [...prevCategories, newCategory[0]]
                    return updatedCategories
                })

            })
            .catch((error) => {
                console.error('Error adding category:', error);
            })
    }


    const newCategoryModal = <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
                className="flex w-full justify-end text-gray-500 hover:text-gray-700"
                onClick={(e) => setModalToggle('')}
            >
                <FiX />
            </button>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                {isEditing ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={isEditing ? handleSaveEdit : handleSaveAdd}>
                <div className="mb-4">
                    <label htmlFor="demographic" className="block text-sm font-medium text-gray-700">
                        Demographic
                    </label>
                    <select
                        id="demographic"
                        name="demographic"
                        value={formData.demographic}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    >
                        <option value='' disabled>select demographic</option>
                        <option value="U">Unisex</option>
                        <option value="K">Kids</option>
                        <option value="M">Men</option>
                        <option value="W">Women</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
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
                        {isEditing ? 'Save Changes' : 'Add Category'}
                    </button>
                </div>
            </form>

        </div>
    </div>

    return (
        <div className="flex justify-center mt-8">
        <div className="overflow-x-auto w-full max-w-4xl">
        <div className = 'flex flex-row'>
            <h3>Add Category</h3>
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
                <th className="px-4 py-2 text-left">Category ID</th>
                <th className="px-4 py-2 text-left">Category Name</th>
                <th className="px-4 py-2 text-left">Demographic</th>
                <th className="px-4 py-2 text-left"></th>
                <th className="px-4 py-2 text-left"></th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.category_id} className="border-b">
                  <td className="px-4 py-2">{category.category_id}</td>
                  <td className="px-4 py-2">{category.category_name}</td>
                  <td className="px-4 py-2">{category.demographic}</td>
                  <td>
                  <button
                    className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(category)}
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  </td>
                  <td>
                  <button
                    className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(category.category_id)}
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
        {modalToggle && newCategoryModal}
      </div>
    )
}