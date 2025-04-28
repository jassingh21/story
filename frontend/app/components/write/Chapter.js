import { writeChapter } from "@/app/services/story";
import React, { useState } from "react";
import '../../../app/globals.css'
import Spinner from "../Spinner";
const Chapter = ({ id, number, name, content, token }) => {
  const [chapterName, setChapterName] = useState(name);
  const [chapterContent, setChapterContent] = useState(content);
  const [ loading , setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await writeChapter(token, chapterContent, id, chapterName, number);
    if(data){
      setLoading(false);
    }
   // console.log(data);
   /* console.log("Updated Chapter:", {
      storyId: id,
      name: chapterName,
      content: chapterContent,
      number: number,
    });*/
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-xl text-white">
      <h2 className="text-2xl sm:text-3xl font-bold text-purple-500 font-amaranth mb-4">
        Chapter {number}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input for Chapter Name */}
        <div>
          <label
            htmlFor={`name-${id}`}
            className="block text-sm sm:text-base font-semibold text-gray-300 mb-2"
          >
            Chapter Name
          </label>
          <input
            type="text"
            id={`name-${id}`}
            name="name"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            placeholder="Enter chapter name"
          />
        </div>

        {/* Input for Chapter Content */}
        <div>
          <label
            htmlFor={`content-${id}`}
            className="block text-sm sm:text-base font-semibold text-gray-300 mb-2"
          >
            Chapter Content
          </label>
          <textarea
  id="content"
  name="content"
  value={chapterContent}
  onChange={(e) => setChapterContent(e.target.value)}
  rows="6"
  className="w-full scrollbar-transparent p-3 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
  placeholder="Write your story content here..."
/>

        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full p-3 bg-purple-500 text-white rounded-md font-semibold hover:bg-purple-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-lg"
        >
          Save Changes
        </button>
        {loading && <Spinner/>}
      </form>
    </div>
  );
};

export default Chapter;
