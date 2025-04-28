import Image from 'next/image';
import React from 'react';

const Hero = () => {
  const cards = [
    {
      id: 1,
      title: "Title 1",
      image: "/ex-2.jpg",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
    },
    {
      id: 2,
      title: "Title 2",
      image: "/ex-2.jpg",
      description:
        "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    {
      id: 3,
      title: "Title 3",
      image: "/ex-2.jpg",
      description:
        "Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
      id: 4,
      title: "Title 3",
      image: "/ex-2.jpg",
      description:
        "Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
      id: 5,
      title: "Title 3",
      image: "/ex-2.jpg",
      description:
        "Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
  ];

  return (
    <div className="bg-[url('/bg-6.jpg')] bg-cover bg-center px-4 py-8">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border border-gray-700 bg-[#1a1a2e] rounded-lg shadow-lg w-80 h-fit flex flex-col items-center text-sm text-gray-300 p-4 space-y-4"
          >
            <div className="w-full flex justify-center">
              <Image
                src={card.image}
                width={150}
                height={150}
                alt={card.title}
                className="rounded-full border border-gray-600 shadow-md"
              />
            </div>
            <div className="w-full text-center">
              <div className="text-lg font-bold text-orange-500 mb-2">
                {card.title}
              </div>
              <div className="text-gray-300 text-sm leading-relaxed">
                {card.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
