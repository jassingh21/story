"use client";
import React, { useEffect, useState } from "react";
import { getStories } from "@/app/services/story";
import Link from "next/link";
import Spinner from "@/app/components/Spinner";
import { motion } from "framer-motion";

const RecentStories = () => {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const data = await getStories(page, 10);
      if (data) {
        setStories(data.stories);
        setTotalPages(data.totalPages);
      }
      setLoading(false);
    };

    fetchStories();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="w-full min-h-screen py-10 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-center text-4xl font-bold text-purple-400 mb-8"
        >
          Recent Stories
        </motion.h2>

        {stories.map((story, index) => (
          <motion.div
            key={story._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(147, 51, 234, 0.5)" }}
            className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-md rounded-lg p-6 mb-6 transition-all"
          >
            <h3 className="text-3xl font-semibold text-white mb-3">{story.title}</h3>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {story.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-lg text-sm tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-lg font-medium leading-relaxed bg-gray-700/70 p-4 rounded-lg border border-gray-600">
              {story.synopsis}
            </p>

            <div className="text-center mt-5">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link
                  href={`/pages/stories/read/${story._id}`}
                  className="inline-block text-purple-300 font-semibold text-lg bg-purple-700/80 px-4 py-2 rounded-lg hover:bg-purple-800 transition-all"
                >
                  Read More
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-6 mt-10">
          <motion.button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            whileTap={{ scale: 0.9 }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition disabled:bg-gray-500 disabled:cursor-not-allowed shadow-md shadow-purple-500"
          >
            Previous
          </motion.button>

          <span className="text-lg text-purple-400 font-semibold">
            Page {page} of {totalPages}
          </span>

          <motion.button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            whileTap={{ scale: 0.9 }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition disabled:bg-gray-500 disabled:cursor-not-allowed shadow-md shadow-purple-500"
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default RecentStories;
