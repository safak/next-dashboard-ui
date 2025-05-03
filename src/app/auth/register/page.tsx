'use client'
import HomeNavbar from '@/components/HomeNavbar'
import Link from 'next/link'
import React from 'react'

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <HomeNavbar />
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Create an Account</h2>
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Create a password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
        <div className="mt-6 text-center">
          <Link href="/">
            <button className="text-blue-600 hover:underline">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage