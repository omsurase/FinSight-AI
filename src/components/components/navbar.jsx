// components/Navbar.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='bg-gray-800 p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        {/* Logo/Brand */}
        <div className='text-white text-2xl font-bold flex items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 mr-2' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          FinSight AI
        </div>

        {/* Navigation Buttons */}
        <div className='flex space-x-4'>
          <Link 
            to='/login' 
            className='bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out'
          >
            Login
          </Link>
          <Link 
            to='/signup' 
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out'
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}