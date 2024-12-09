'use client'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import ProductLoadingCard from '../components/ProductLoadingCard'
import { FiPlus, FiEdit, FiTrash, FiX } from "react-icons/fi"

const sizeOptions = {
    shirt: ["XS", "S", "M", "L", "XL", "XXL"],
    shoes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    pants: ["28", "30", "32", "34", "36", "38", "40"]
  }


export default function Products() {

    /*
    const queryTemplate = {
        action: 'insert/select/delete/update'<string>,
        table: is implied,
        columns: [col1, col2, col3] can use aliases and then map them in route,
        filters: {
            conditions: [
                {column1: value, operator: is/=/!=, value= value},
            ],
            logic: "AND/OR"
        }
    }

    const queryTemplateUpdate = {
        action: 'update',
        row: PK_val
        columns: [col1, col2, col3],
        values: [val1, val2, val3],
    }


    const query = {
        action: 'SELECT',
        columns: [productName, size, price],
        filters:  {
            conditions: [
                {column1: category, operator: =, value= 'shirts'}
            ]
        }
    }

    const insertQuery = {

        action: 'INSERT',
        columns: [... columns],
        values: [...values]
    }
    */


    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [modalToggle, setModalToggle] = useState('')
    const [filterIsOpen, setFilterisOpen] = useState(false)
    const [filterSelectedOption, setFilterSelectedOption] = useState("all")
    const [sizeOptionsForSelectedCategory, setSizeOptionsForSelectedCategory] = useState([])
    const [filtereredProducts, setFilteredProducts] = useState([])
    const [formData, setFormData] = useState({
        productName: '',
        brand: '',
        category: '',
        productID: '',
        mode: '',
        size: '',
        demographic: '',
    })

    useEffect(() => {

        const getData = async () => {

            try {
                const response = await fetch('/api/products')

                if (!response.ok) {
                    throw new Error('failed to fetch data bozo')
                }

                let returnedData = await response.json()
                let data= returnedData.data.map((product) => {
                    return {
                        ...product,
                        image: '/sample_product_image.png'
                    }
                })

                setProducts(data)
                setFilteredProducts(data)
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

    useEffect(() => {

        if (formData.category) {
            const category = formData.category.toLowerCase()
            setSizeOptionsForSelectedCategory(sizeOptions[category] || [])
            setFormData(prev => ({ ...prev, size: ""}))
        }

    }, [formData.category])

    useEffect(() => {

        setFilteredProducts(filterSelectedOption === 'all' ? products : products.filter(item => item.category_name.toLowerCase() === filterSelectedOption))

    }, [filterSelectedOption, products])

    const resetFormData = () => {
        setFormData({
            productName: '',
            brand: '',
            category: '',
            productID: '',
            mode: '',
            size: '',
            demographic: '',
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.mode === 'delete') {
            handleDeleteProduct()
        } else if (formData.mode === 'create') {
            handleAddProduct()
    } else if (formData.mode === 'edit'){
        handleEditProduct()
    }
}

    const handleChange = (e) => {

        const { name, value } = e.target

        if (name === "productID") {
            const selectedProduct = products.find(product => Number(product.product_id)=== Number(value));
            if (selectedProduct) {
                setFormData(prevData => ({
                    ...prevData,
                    productID: value,
                    productName: selectedProduct.product_name,
                    brand: selectedProduct.brand,
                    category: selectedProduct.category,
                }));
            }
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const toggleDropdown = () => setFilterfilterIsOpen(!filterfilterIsOpen)


    const handleAddProduct = () => {

        const response = fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {

                const newProductWithImage = {
                    ...data[0],
                    image: '/sample_product_image.png'
                }
                
                setProducts(prevData => {
                    return [...prevData, newProductWithImage]
                })

                setModalToggle('')
            }).catch(error => {
                console.error('query failed', error)
            })
    }

    const handleDeleteProduct = async () => {

        let requestJson = {
                action: formData.mode,
                product_id: formData.productID
        }

        const response = fetch('/api/products', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(requestJson)
        }).then(response => {

            if (!response.ok) {
                throw new Error('failed to delete product')
            }
            
            return response.json()
        }).then(() => {

            setProducts(prevProducts => prevProducts.filter(product => product.product_id != formData.productID))
        })
    }

    const handleEditProduct = async () => {

        const response = await fetch('/api/products', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json()

        const updatedProduct = {
            ...data,
            image: '/sample_product_image.png'
        }

        setProducts(prevProducts => [
            ...prevProducts.map(product =>
                product.product_id === updatedProduct.product_id ? updatedProduct : product
            ),
        ]);
        setModalToggle('')
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
                        <option value="" disabled>choose category</option>
                        <option value="shirt">Shirts</option>
                        <option value="shoes">Shoes</option>
                        <option value="pants">Pants</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                        Size
                    </label>
                    <select
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="mt-1 mb-5 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                        disabled={!formData.category}
                    >   
                        <option value="" disabled>choose a size</option>
                        {sizeOptionsForSelectedCategory.map((size, index) => (
                            <option key={index} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                        Demographic
                    </label>
                    <select
                        id="demographic"
                        name="demographic"
                        value={formData.demographic}
                        onChange={handleChange}
                        className="mt-1 mb-5 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                        disabled={!formData.size}
                    >   
                        <option value="" disabled>choose a demographic</option>
                        <option value="W">Women</option>
                        <option value="M">Men</option>
                        <option value="K">Children</option>

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
                <label htmlFor="productID" className="block text-sm font-medium text-gray-700">
                    Product ID
                    <select
                        name="productID"
                        value={formData.productID}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="" disabled>Select a product</option>
                        {products.map((product) => (
                            <option key={product.product_id} value={product.product_id}>
                                {product.product_id}
                            </option>
                        ))}
                    </select>
                    <div className="mb-4">
                        Product Name
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
                </label>
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
                        Edit Product
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
                Delete Existing Product
            </h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="productID" className="block text-sm font-medium text-gray-700">
                    Product ID
                <select
                    name="productID"
                    value={formData.productID}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                >
                    <option value="" disabled>Select a product</option>
                    {products.map((product) => (
                        <option key={product.product_id} value={product.product_id}>
                            {product.product_id}
                        </option>
                    ))}
                </select>
                <div className="mb-4">
                        Product Name
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        readOnly
                    />
                </div>
                </label>
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
                    onClick={(e) => {
                        resetFormData();
                        setModalToggle('create');
                    }}
                >
                    <FiPlus size={20} />
                </button>
                <button
                    className='flex items-center justify-center w-10 h-10 mx-2 rounded-lg text-white hover:bg-yellow-500 transition transform hover:scale-105'
                    title='Edit product'
                    onClick={(e) => {
                        resetFormData();
                        setModalToggle('edit');
                    }}
                >
                    <FiEdit size={20} />
                </button>
                <button
                    className='flex items-center justify-center w-10 h-10 mx-2 rounded-lg text-white hover:bg-red-600 transition transform hover:scale-105'
                    title='Delete account'
                    onClick={(e) => {
                        resetFormData();
                        setModalToggle('delete');
                    }}
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
                                Category: {filterSelectedOption}
                            </button>
                            {filterIsOpen && (
                                <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-10">
                                    <ul className="py-2 text-gray-700">
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-300" onClick={() => setFilterSelectedOption('all')}>all</li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-300" onClick={() => setFilterSelectedOption('shirts')}>Shirts</li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-300" onClick={() => setFilterSelectedOption('shoes')}>Shoes</li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-300" onClick={() => setFilterSelectedOption('pants')}>Pants</li>
                                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-300" onClick={() => setFilterSelectedOption('other')}>Other</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            <div className='grid mt-10 mb-6 ml-56 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-y-6'>
                {isLoading ? new Array(3).fill(null).map((_, index) => (
                    <ProductLoadingCard key={index} />))

                    : filtereredProducts.map((product, index) => (
                        <div
                            className='w-full'
                            key={index}
                            id = {product.id}
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