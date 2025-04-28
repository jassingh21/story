"use client";
import React, { useState } from 'react';
import { register } from '../services/auth';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';

const Register = () => {
  const router = useRouter();
  // State to manage modal visibility
  const [isOpen, setIsOpen] = useState(false);

  // State to store input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Toggle modal visibility
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault(); // Prevent form from reloading the page
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);
    const data = await register(username, email, password);
    if (data) {
      console.log("Registration successful");
      setLoading(false);
      router.push("/pages/welcome"); // Redirect to a welcome page after registration
    }

    // Reset the form if needed
    setUsername('');
    setEmail('');
    setPassword('');
    toggleModal(); // Close modal after submit
  };

  return (
    <div>
      {/* Button to trigger the modal */}
      <button
        onClick={toggleModal}
        className="rounded-md px-4 py-2 text-green-200"
      >
        Register
      </button>

      {/* Modal/Popup Register Form */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white bg-opacity-15 p-6 rounded-md w-96 shadow-lg">
            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleModal} // Close the modal
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
            {loading ? "Registering..." : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
