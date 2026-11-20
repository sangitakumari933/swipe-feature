import React from 'react'
import { Heart, X, MessageCircle, ArrowLeft, RotateCcw, Sparkles, MapPin } from "lucide-react";
import { useContext } from "react";
import { ApiContext } from "../context/api.jsx";

const MatchedUsers = ({setView }) => {
  const {matches} = useContext(ApiContext);
  return (
     <main className="w-full max-w-sm flex-1 bg-white rounded-3xl shadow-lg p-5 overflow-y-auto max-h-[600px]">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Your Matches</h2>
          <p className="text-xs text-gray-400 mb-5">
            Only mutual likes appear here.
          </p>

          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
                <Heart className="text-pink-400" size={28} />
              </div>
              <p className="text-gray-700 font-semibold">No matches yet</p>
              <p className="text-gray-400 text-sm mt-1 max-w-[220px]">
                Keep swiping right on profiles you like to find a mutual match.
              </p>
              <button
                onClick={() => setView("feed")}
                className="mt-6 px-6 py-2.5 bg-pink-500 text-white text-sm font-semibold rounded-full hover:bg-pink-600 transition-colors"
              >
                Back to Swiping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-gray-50 hover:bg-pink-50/60 transition-colors"
                >
                  <img
                    src={match.photo}
                    alt={match.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-pink-400"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">
                      {match.name}, {match.age}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {match.city} · {match.bio}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center">
                    <Heart size={16} className="fill-current" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
  )
}

export default MatchedUsers
