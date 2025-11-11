'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

export default function Page() {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage('User registered successfully');
        setFormData({
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        });
      } else {
        setStatusMessage(`Error: ${data.errorMessage || 'Failed to register user.'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Something went wrong');
    }
  };  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="firstName">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="lastName">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your last name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Register
        </button>
        {statusMessage && (
          <p className="text-center mt-4 text-sm">
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}
