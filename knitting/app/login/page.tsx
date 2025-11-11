'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

export default function Page() {
  const [formData, setFormData] = useState({
    username: '',
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
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage('Signed in successfully!');
        setFormData({
          username: '',
          password: '',
        });
      } else {
        setStatusMessage(`Error: ${data.errorMessage || 'Sign in failed.'}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setStatusMessage('Something went wrong');
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
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
          Sign In
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