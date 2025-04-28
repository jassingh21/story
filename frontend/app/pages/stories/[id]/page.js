"use client";
import Nav from "@/app/components/profile/Nav";
import Chapter from "@/app/components/write/Chapter";
import { checkAuth } from "@/app/services/checkAuth";
import { getCollab, getStory } from "@/app/services/story";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Id = () => {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);
  const [newChapters, setNewChapters] = useState([]);
  const [token, setToken] = useState("");
  const [collaborators , setCollaborators] = useState([]);

  // Add a new chapter
  const handleNewChapter = () => {
    const nextChapterNumber =
      chapters.length + newChapters.length + 1; // Sequentially assign chapter numbers
    setNewChapters((prev) => [
      ...prev,
      { number: nextChapterNumber, name: "", content: "" },
    ]);
  };

  // Remove a specific chapter
  const handleRemoveChapter = (number) => {
    setNewChapters((prev) => prev.filter((chapter) => chapter.number !== number));
  };
  const collab = async()=>{
    const token = localStorage.getItem("token");
    const data = await getCollab(token , id);
    if(data){
      setCollaborators(data.collaborators);
    }
    //console.log(data);
  }

  useEffect(() => {
    if(checkAuth()){

      const token = localStorage.getItem("token");
      setToken(token);
      const content = async () => {
        const data = await getStory(id);
        if (data?.Message) {
          setChapters(data.Message.content);
        }
        console.log(data);
      };
      content();
      collab();
    }else{
      window.location.href = "/"
    }
  }, [id]);

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-300 min-h-screen">
      <Nav />
      <div className="flex space-x-4 mb-4 items-center">
        <button
          onClick={handleNewChapter}
          className="px-4 py-2 bg-purple-600 m-2 text-white rounded"
        >
          Add Chapter
        </button>
        <Link
          href={`/pages/stories/${id}/invite`}
          className="px-4 py-2 bg-purple-600 m-2 text-white rounded"
        >
          Invite Collaborators
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <div className="w-full overflow-x-auto">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    {collaborators.length > 0 &&
      collaborators.map((collaborator) => (
        <Link href={`/pages/${collaborator._id}`}
          key={collaborator._id}
          className="flex items-center space-x-4 p-2 bg-purple-50 shadow-md rounded-lg"
        >
          <Image
            src={collaborator.profilePicture}
            width={50}
            height={50}
            alt="Collaborator Image"
            className="rounded-full"
          />
          <span className="text-purple-900 font-medium">
            {collaborator.username}
          </span>
        </Link>
      ))}
  </div>
</div>

</div>

      </div>

      <div className="space-y-4 m-2">
        {chapters.length > 0
          ? chapters.map((chapter) => (
              <Chapter
                key={chapter._id}
                id={chapter.storyId}
                number={chapter.chapterNumber}
                name={chapter.name}
                content={chapter.content}
                token={token}
              />
            ))
          : null}

        {newChapters.map((chapter) => (
          <div key={`new-${chapter.number}`} className="relative  p-4 rounded">
            <Chapter
              id={id} // Pass the story ID
              number={chapter.number}
              name={chapter.name}
              content={chapter.content}
              token={token}
            />
            <button
              onClick={() => handleRemoveChapter(chapter.number)}
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Id;
