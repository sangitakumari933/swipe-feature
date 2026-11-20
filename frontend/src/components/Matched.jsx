import React from 'react'
import { Heart } from "lucide-react";

const Matched = ({activeMatch, setActiveMatch, setView}) => {
  
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center px-6">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300 italic mb-10 text-center">
            It&apos;s a Match!
          </h2>

          <div className="flex items-center justify-center">
            <img
              src="https://img.magnific.com/free-photo/young-beautiful-girl-posing-black-leather-jacket-park_1153-8104.jpg?semt=ais_hybrid&w=740&q=80"
              alt="You"
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-2xl -mr-3"
            />
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center z-10 border-4 border-black shadow-lg">
              <Heart className="text-white fill-white" size={20} />
            </div>
            <img
              src={activeMatch.photo}
              alt={activeMatch.name}
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-2xl -ml-3"
            />
          </div>

          <p className="text-white/90 text-lg mt-8 text-center">
            You and <span className="font-bold text-white">{activeMatch.name}</span> liked each other.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-[260px] mt-8">
            <button
              onClick={() => {
                setActiveMatch(null);
                setView("matches");
              }}
              className="w-full py-3.5 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg"
            >
              View Matches
            </button>
            <button
              onClick={() => setActiveMatch(null)}
              className="w-full py-3.5 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Keep Swiping
            </button>
          </div>
        </div>
  )
}

export default Matched;
