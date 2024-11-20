'use client'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import ProductLoadingCard from '../components/ProductLoadingCard'
import { FiPlus, FiEdit, FiTrash, FiX } from "react-icons/fi"


export default function Products() {

    /* const queryTemplate = {
        fetchAll: string (T/F , True executes a SELECT * without filtering
        columns: {
            productName: string,
            productPrice: string in the format xx.xx,
            productCategory: string,
            productBrand: string,
            productSize: string,
            demographic: string
        },

        pagination: {
            limit: value,
        },

        sort: {
            orderby: keyword,
            column: value                   //this will probably need to be changed I dont like the idea of leaking the column names
        }
    }

    */



    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [modalToggle, setModalToggle] = useState('')
    const [filterIsOpen, setFilterisOpen] = useState(false)
    const [filterSelectedOption, setFilterSelectedOption] = useState("All")
    const [formData, setFormData] = useState({
        productName: '',
        brand: '',
        category: '',
        productID: '',
        mode: ''
    })

    useEffect(() => {

        const getData = async () => {

            const onLoadSelectQuery = {
                fetchAll: 'True'
            }

            try {
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(onLoadSelectQuery)
                })

                if (!response.ok) {
                    throw new Error('failed to fetch data bozo')
                }

                let returnedData = await response.json()
                let data= returnedData.data.map((product) => {
                    return {
                        ...product,
                        image: '/sample_product_image.png'
                    }

                });
                setProducts(data)
                setIsLoading(false)
            } catch (error) {
                console.log('something went wrong', error)
            }

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

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Product Data: ", formData)
    }

    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const toggleDropdown = () => setFilterfilterIsOpen(!filterfilterIsOpen)
    const handleFilter = (category) => {
        console.log('we will do something here eventually')
    }

    const createModal = <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
                className="flex w-full justify-end text-gray-500 hover:text-gray-700"
                onClick={(e) => setModalToggle('')}
            >
                <FiX />
            </button>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Add New Product
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                        Brand
                    </label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    >
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
                        Add Product
                    </button>
                </div>
            </form>

        </div>
    </div>

    const editModal = <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
                className="flex w-full justify-end text-gray-500 hover:text-gray-700"
                onClick={(e) => setModalToggle('')}
            >
                <FiX />
            </button>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Edit Existing Product
            </h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="productID" className="block text-sm font-medium text-gray-700">
                        Product ID
                    </label>
                    <input
                        type="text"
                        id="productID"
                        name="productID"
                        value={formData.productID}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                        Brand
                    </label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    >
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
                        Add Product
                    </button>
                </div>
            </form>
        </div>
    </div>

    const deleteModal = <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
                className="flex w-full justify-end text-gray-500 hover:text-gray-700"
                onClick={(e) => setModalToggle('')}
            >
                <FiX />
            </button>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                Edit Existing Product
            </h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="productID" className="block text-sm font-medium text-gray-700">
                        Product ID
                    </label>
                    <input
                        type="text"
                        id="productID"
                        name="productID"
                        value={formData.productID}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="w-full bg-red-700 text-white py-2 rounded-md"
                    >
                        Delete Product
                    </button>
                </div>
            </form>
        </div>
    </div>

    return (
        <div>
            <div className='flex flex-row items-center'>
                <h1 className='text-xl pr-10 py-10 ml-[220px]'>Products</h1>
                <button
                    className='flex items-center justify-center w-10 h-10 mx-2 rounded-lg text-white hover:bg-green-600 transition transform hover:scale-105'
                    title='Create product'
                    onClick={(e) => setModalToggle('create')}
                >
                    <FiPlus size={20} />
                </button>
                <button
                    className='flex items-center justify-center w-10 h-10 mx-2 rounded-lg text-white hover:bg-yellow-500 transition transform hover:scale-105'
                    title='Edit product'
                    onClick={(e) => setModalToggle('edit')}
                >
                    <FiEdit size={20} />
                </button>
                <button
                    className='flex items-center justify-center w-10 h-10 mx-2 rounded-lg text-white hover:bg-red-600 transition transform hover:scale-105'
                    title='Delete account'
                    onClick={(e) => setModalToggle('delete')}
                >
                    <FiTrash size={20} />
                </button>
            </div>
                <div className="ml-[220px] mt-6">
                    <div className="relative inline-block">
                        <div className="relative">
                            <button
                                className="block w-full px-4 py-2 bg-gray-200 rounded-lg text-black focus:outline-none"
                                onClick={() => setFilterisOpen(!filterIsOpen)}
                            >
                                Filter by Category
                            </button>
                            {filterIsOpen && (
                                <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-10">
                                    <ul className="py-2 text-gray-700">
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-300" onClick={() => handleFilter('shirts')}>Shirts</li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-300" onClick={() => handleFilter('shoes')}>Shoes</li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-300" onClick={() => handleFilter('pants')}>Pants</li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-300" onClick={() => handleFilter('accessories')}>Accessories</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            <div className='grid mt-10 ml-56 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-6'>
                {isLoading ? new Array(3).fill(null).map((_, index) => (
                    <ProductLoadingCard key={index} />))

                    : products.map((product, index) => (
                        <div
                            className='w-full'
                            key={index}
                            id={index === products.length - 1 ? 'last-product' : ''}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
            </div>
            {modalToggle === 'create' ? createModal : <></>}
            {modalToggle === 'edit' ? editModal : <></>}
            {modalToggle === 'delete' ? deleteModal : <></>}
        </div>
    )
}