"use client";
import { createStory } from "@/app/services/user";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Spinner from "@/app/components/Spinner"
const Create = () => {
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading , setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    tags: [],
    collaborators: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags" || name === "collaborators") {
      setFormData({
        ...formData,
        [name]: value ? value.split(",").map((item) => item.trim()) : [],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    
    const dataToSend = {
      ...formData,
      tags: formData.tags.filter((tag) => tag),
    };

    try {
      setLoading(true);
      const data = await createStory(
        dataToSend.title,
        dataToSend.synopsis,
        dataToSend.tags,
        token
      );
      if (data) {
        setLoading(false);
        router.replace(`/pages/stories`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-950 rounded-xl shadow-md border-2 border-purple-400  font-amaranth sm:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-500">
        Create a New Story
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-start gap-6 md:gap-8"
      >
        {/* Title */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <label htmlFor="title" className="text-lg font-medium text-fuchsia-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 w-60"
            required
          />
        </div>
  
        {/* Synopsis */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <label
            htmlFor="synopsis"
            className="text-lg font-medium text-fuchsia-300"
          >
            Synopsis
          </label>
          <textarea
            id="synopsis"
            name="synopsis"
            value={formData.synopsis}
            onChange={handleChange}
            rows="1"
            className="p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 w-60"
            required
          />
        </div>
  
        {/* Tags */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <label htmlFor="tags" className="text-lg font-medium text-fuchsia-300">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            onChange={handleChange}
            className="p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 w-60"
            placeholder="e.g. Horror, Romantic"
          />
        </div>
  
        {/* Submit Button */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <button
            type="submit"
            className="py-3 px-6 bg-fuchsia-900 text-fuchsia-300 text-lg rounded-md hover:bg-fuchsia-400 hover:text-fuchsia-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          >
            Create
          </button>
        </div>
        {loading && <Spinner/> }
      </form>
    </div>
  );
  
};

export default Create;
