"use client";
import PublicNav from "@/app/components/PublicNav";
import { getStory } from "@/app/services/story";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Read = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);

  const getStoryy = async () => {
    try {
      const storyy = await getStory(id);
      if (storyy) {
        setStory(storyy.Message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStoryy();
  }, [id]);

  if (!story) {
    return <div className="text-center text-gray-600">Loading story...</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-5">

      <PublicNav/>
      </div>
      <div className="mb-6">
        <h1 className="text-4xl shadow-lg w-fit p-2 rounded-lg font-bold bg-white font-amaranth text-purple-600">{story.title}</h1>
        <p className="text-gray-500 font-amaranth mt-2 shadow-lg italic bg-white p-2 rounded-lg">{story.synopsis}</p>
        <div className="mt-8 text-sm text-gray-500">
        <Link href={`/pages/${story.author._id}`} className="text-lg flex items-center font-comic">Author: {story.author.username} <Image src={story.author.profilePicture} width={50} height={50} alt="img" className="rounded-full shadow-lg border-2 mx-4 border-purple-300 shadow-purple-300"/></Link>
        
      </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {story.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 shadow-xl shadow-purple-300 text-sm font-semibold text-white bg-pink-500 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {story.content.map((chapter) => (
          <div
            key={chapter._id}
            className="p-6 bg-white shadow-md rounded-lg border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-purple-800">
              Chapter {chapter.chapterNumber}: {chapter.name}
            </h2>
            <p className="text-gray-700 font-comic text-lg mt-4 whitespace-pre-line">
              {chapter.content}
            </p>
          </div>
        ))}
      </div>

      <p className="text-gray-600">Published: {new Date(story.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default Read;
