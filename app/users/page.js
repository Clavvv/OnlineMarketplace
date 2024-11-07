'use client'
import { useState } from 'react'


export default function Register() {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {

    e.preventDefault()
    console.log('Form submitted', formData)

  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Create an account</h2>

        <form onSubmit={handleSubmit}>
          <div class="flex space-x-4 mb-4">
            <div class="flex-1">
              <label htmlFor="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                onChange = {handleChange}
                required
              />
            </div>

            <div class="flex-1">
              <label htmlFor="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange = {handleChange}
                class="mt-1 block w-full p-2 border border-gray-300 text-black rounded-md"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700'>Phone Number</label>
            <input
              type="tel"
              id='phoneNumber'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleChange}
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md text-black'
            >

            </input>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
