import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Hero Section */}
      <div className='container mx-auto px-4 py-16 text-center'>
        <h1 className='text-5xl font-bold text-gray-800 mb-6'>
          Intelligent Financial Investment Advisory
        </h1>
        <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
          Leverage AI-powered insights to make smarter investment decisions. 
          FinSight AI analyzes market trends, assesses risk, and provides 
          personalized investment recommendations.
        </p>
        <div className='space-x-4'>
          <Link 
            to='https://www.investopedia.com/investing-101-4689754' 
            target="_blank"
            className='bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out'
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Rest of the code remains the same */}
      ...
    </div>
  )
}