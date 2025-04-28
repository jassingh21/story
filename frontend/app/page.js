"use client"
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Login from "./components/Login";
import PublicNav from "./components/PublicNav";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prev) => prev + Math.floor(Math.random() * 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const featuredStories = [
    { id: 1, title: "The Enchanted Forest", snippet: "A tale of mystery and magic deep in the woods...", contributors: 5 },
    { id: 2, title: "Galactic Odyssey", snippet: "A journey across the stars in search of a new home...", contributors: 8 },
    { id: 3, title: "The Lost Diary", snippet: "Unraveling the secrets of an old journal...", contributors: 3 }
  ];

  const testimonials = [
    { id: 1, quote: "This platform sparked my creativity like never before!", author: "Alex R." },
    { id: 2, quote: "Collaborative writing made storytelling a shared adventure.", author: "Jamie L." }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <PublicNav />

      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold drop-shadow-md"
        >
          Write Together, Imagine Forever.
        </motion.h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl">
          Join a community of storytellers where creativity knows no bounds. Start a story, collaborate with others, and watch your imagination unfold in real time.
        </p>
        <div className="mt-6 flex space-x-4">
          <Link href={"/pages/login"} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow">
            Start Writing
          </Link>
          <Link href={"/pages/recent-stories"} className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-lg shadow">
            Explore Stories
          </Link>
        </div>
        <div className="mt-6 text-gray-400 text-sm">
          <span className="font-bold text-blue-400">{users}</span> active users writing now
        </div>
      </div>

      <div className="pb-28 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center">Stories Shaped by Many Minds</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStories.map((story) => (
            <div key={story.id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-xl font-semibold">{story.title}</h3>
              <p className="text-gray-400 mt-2">{story.snippet}</p>
              <p className="text-sm text-gray-500 mt-4">Contributors: {story.contributors}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-12 my-32 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">A Global Network of Creators</h2>
        <p className="text-gray-400 mt-2">Over <span className="font-bold text-blue-400">{users + 5000}</span> writers collaborating worldwide!</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              <p className="text-sm text-gray-500 mt-4">- {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
      

      <div className="py-12 max-w-md mx-auto px-6 bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold">Subscribe to Our Newsletter</h2>
       
        <div className="mt-4">
          <input type="email" placeholder="Enter your email" className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow">
            Subscribe
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
