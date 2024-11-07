'use client'
import {useState, useEffect} from 'react';
import { FiPlus, FiEdit, FiTrash, FiX } from "react-icons/fi"

export default function Categories() {

    const [categories, setCategories] = useState([])
    const [modalToggle, setModalToggle] = useState(false)
    const [formData, setFormData] = useState({
        sizeID: '',
        categoryName: '',
        demographic: '',
        categoryID: '',
        mode: ''
    })


    useEffect(() => {

        const getData = async () => {
            await fetch('/category_sample.json')
                .then((response) => response.json())
                .then((jsonData) => {
                    setCategories(jsonData)
                })
                .catch((error) => console.error('json no load: ', error))
        }
        getData()

    }, [])

    useEffect(() => {

        if (formData.mode !== modalToggle) {

        setFormData((prevData) => ({
            ...prevData,
            mode: modalToggle
        }))
    }

    }, [modalToggle])

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleDelete = () => {
        console.log('deleting...')
    }

    const handleEdit = () => {
        console.log('editing...')
    }

    const handleAdd = (e) => {
        e.preventDefault()
        console.log('Category Data: ', formData)

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
                Add New Category
            </h2>
            <form onSubmit={handleAdd}>
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
                        Add Category
                    </button>
                </div>
            </form>

        </div>
    </div>

    return (
        <div className="flex justify-center">
        <div className="overflow-x-auto w-full max-w-4xl">
        <div className = 'flex flex-row'>
            <h3>Add Category</h3>
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
                <tr key={category.categoryID} className="border-b">
                  <td className="px-4 py-2">{category.categoryID}</td>
                  <td className="px-4 py-2">{category.category_name}</td>
                  <td className="px-4 py-2">{category.demographic}</td>
                  <td>
                  <button
                    className="px-2 py-1 mx-1 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(category.categoryID)}
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  </td>
                  <td>
                  <button
                    className="px-2 py-1 mx-1 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(category.categoryID)}
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