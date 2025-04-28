"use client";
import React, { useState } from 'react';
import { login, register } from '../services/auth';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setShowRegister(false); // Reset to login form when closing the modal
  };

  const handleRegisterToggle = () => {
    setShowRegister(!showRegister);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = await login(email, password);
    if (data) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUserId" , data.id);
      setLoading(false);
      router.push("/pages/profile");
    }
    setEmail('');
    setPassword('');
    toggleModal();
  };

  const handleSubmitRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = await register(username , email , password);
    if (data) {
      console.log("Registration successful");
      setLoading(false);
      router.push("/pages/welcome"); // Redirect to a welcome page after registration
    }
    setUsername('');
    setEmail('');
    setPassword('');
    toggleModal();
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="rounded-md px-4 py-2 text-purple-100"
      >
        Login
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white  p-6 rounded-md w-96 shadow-lg">
            {showRegister ? (
              <form onSubmit={handleSubmitRegister} >
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Register
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={handleRegisterToggle}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Register
                  </button>
                </div>
              </form>
            )}
            {loading && <Spinner />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
