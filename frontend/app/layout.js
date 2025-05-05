import { Amaranth, Anton, Comic_Neue, Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";


const anton = Anton({subsets : ['latin'],weight : ['400'],variable :"--font-anton"});
const pacifico = Pacifico({subsets : ['latin'] , weight : ['400'],variable : "--font-pacifico"})
const amaranth = Amaranth({subsets : ['latin'] , weight : ['400','700'],variable : "--font-amaranth"})
const comic = Comic_Neue({subsets : ['latin'] , weight : ['400','700','300'],variable : "--font-comic"})
export const metadata = {
  title: "StoryThread",
  description: "a platform that enables writers and storytellers to come together and create unique, collaborative stories. The project allows users to contribute chapters, suggest plot twists, and engage in dynamic, community-driven storytelling.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${pacifico.variable} ${amaranth.variable} ${comic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
