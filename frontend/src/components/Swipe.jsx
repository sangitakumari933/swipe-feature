import React from "react";
import { useState, useRef, useEffect } from "react";
import MatchedUsers from "./MatchedUsers.jsx";
import Matched from "./Matched";
import axios from "axios";

import {
  Heart,
  X,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

import { useContext } from "react";
import { ApiContext } from "../context/api.jsx";

function Swipe() {
  const [view, setView] = useState("feed");
  const [isDragging, setIsDragging] = useState(false);
  const [decision, setDecision] = useState(null);
  const [activeMatch, setActiveMatch] = useState(null);

  const { fetchUsers, profiles, setProfiles, matches, setMatches, fetchMatches } = useContext(ApiContext);

  const [draggedDistance, setDraggedDistance] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  const startPosition = useRef();

  const currDistance = useRef(0);

  const cardRef = useRef(null);

  const SWIPE_THRESHOLD = 120;

  // 1. Start dragging
  const handlePointerDown = (e) => {
    if (!isMobile || isDragging || decision) return;

    e.preventDefault();

    cardRef.current.setPointerCapture(e.pointerId);
    setIsDragging(true);
    startPosition.current = e.clientX;
    currDistance.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const distanceX = e.clientX - startPosition.current;
    currDistance.current = distanceX;
    setDraggedDistance(distanceX);
  };

  const triggerSwipe = (action) => {
    if (decision || profiles.length === 0) return;
    setIsDragging(false);
    setDecision(action);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;

    setIsDragging(false);
    if (currDistance.current > SWIPE_THRESHOLD) {
      triggerSwipe("LIKE");
    } else if (currDistance.current < -SWIPE_THRESHOLD) {
      triggerSwipe("DISLIKE");
    } else {
      currDistance.current = 0;
      setDraggedDistance(0);
    }
  };

  const handleTransitionEnd = async (e) => {
    if (e.propertyName !== "transform" || !decision) return;

    const swipedProfile = profiles[profiles.length - 1];
    const action = decision === "LIKE" ? "like" : "pass";

    setProfiles((prev) => prev.slice(0, -1));
    setDecision(null);
    currDistance.current = 0;
    setDraggedDistance(0);

    try {
      const { data } = await axios.post("http://localhost:5000/api/swipe", {
        swipedId: swipedProfile._id,
        action,
      });

      console.log("Swipe recorded:", data);

      if (data.matchedUser) {
        setActiveMatch(data.matchedUser);
        setMatches((prev) => [...prev, swipedProfile]);
      }
    } catch (error) {
      console.error("Failed to save swipe:", error);
    }
  };

  //calculating the movement
  const currentX = decision
    ? decision === "LIKE"
      ? 600
      : -600
    : draggedDistance;

  const rotation = currentX * 0.04;

  const opacity = decision
    ? 0
    : Math.max(0.45, 1 - Math.abs(currDistance.current) / 500);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-4 font-sans select-none overflow-hidden">
      {/* Top Header */}
      <header className="w-full max-w-sm flex items-center justify-between mb-4">
        {view === "matches" ? (
          <button
            onClick={() => setView("feed")}
            className="flex items-center gap-1.5 text-gray-600 hover:text-pink-500 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        ) : (
          <div className="w-16" />
        )}

        <h1 className="text-3xl font-extrabold text-pink-500 tracking-tighter">
          Coy.
        </h1>

        <button
          onClick={() => setView(view === "feed" ? "matches" : "feed")}
          className={`relative p-2.5 rounded-full shadow-sm transition-all ${
            view === "matches"
              ? "bg-pink-500 text-white"
              : "bg-white text-gray-500 hover:text-pink-500"
          }`}
          aria-label="View Matches"
        >
          <MessageCircle size={22} />
          {matches.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-100">
              {matches.length}
            </span>
          )}
        </button>
      </header>

      {/* Card container */}
      {view === "feed" && (
        <main className="relative flex-1 w-full max-w-sm flex flex-col items-center justify-center min-h-[540px] max-h-[700px]   rounded-2xl ">
          <div className="relative w-full h-[530px]  ">
            {profiles.length > 0 ? (
              profiles.map((person, index) => {
                const isTopCard = index === profiles.length - 1;

                return (
                  <div
                    key={person._id}
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
                    style={{
                      zIndex: index,
                      transform: isTopCard
                        ? `translateX(${currentX}px) rotate(${rotation}deg)`
                        : `scale(${1 - (profiles.length - 1 - index) * 0.04}) `,
                      opacity: isTopCard ? opacity : 1,
                      transition:
                        isDragging && isTopCard
                          ? "none"
                          : "transform 0.4s ease, opacity 0.4s ease",
                      touchAction: "none",
                      cursor: isTopCard ? "grab" : "default",
                    }}
                    ref={isTopCard ? cardRef : null}
                    onPointerDown={
                      isTopCard && isMobile ? handlePointerDown : undefined
                    }
                    onPointerMove={
                      isTopCard && isMobile ? handlePointerMove : undefined
                    }
                    onPointerUp={
                      isTopCard && isMobile ? handlePointerUp : undefined
                    }
                    onPointerCancel={
                      isTopCard && isMobile ? handlePointerUp : undefined
                    }
                    onTransitionEnd={
                      isTopCard ? handleTransitionEnd : undefined
                    }
                  >
                    {/* Profile image */}
                    <img
                      src={person.photo}
                      alt={person.name}
                      draggable="false"
                      className="w-full h-full object-cover  pointer-events-none select-none"
                    />

                    {/* Gradient and profile details */}
                    <div className="absolute bottom-0 w-full p-6 pt-32 bg-gradient-to-t from-black/95 via-black/60 to-transparent rounded-b-2xl flex flex-col justify-end pointer-events-none">
                      <div className="flex items-end gap-3 text-white mb-1">
                        <h2 className="text-3xl font-bold">{person.name}</h2>
                        <span className="text-2xl font-light">
                          {person.age}
                        </span>
                      </div>
                      <p className="text-gray-300 font-medium flex items-center gap-1 mb-2">
                        📍 {person.city}
                      </p>
                      <p className="text-white/90 text-sm mb-6">{person.bio}</p>

                      <div className="flex justify-center gap-8 z-50 pointer-events-auto pb-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isTopCard) triggerSwipe("DISLIKE");
                          }}
                          className={`w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg text-red-400 hover:bg-red-500/80 hover:text-white hover:border-red-500 transition-all ${!isTopCard ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                        >
                          <X size={32} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isTopCard) triggerSwipe("LIKE");
                          }}
                          className={`w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg text-pink-500 hover:bg-pink-400 hover:text-pink-200 hover:border-pink-100 transition-all ${!isTopCard ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                        >
                          <Heart
                            size={28}
                            strokeWidth={2.5}
                            className="fill-current"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-5">
                  <Heart size={36} className="text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  You&apos;re all caught up!
                </h3>
                <p className="text-gray-500 text-sm mt-2 max-w-[240px]">
                  There are no more profiles left to discover right now.
                </p>

                <div className="flex flex-col gap-3 w-full max-w-[220px] mt-7">
                  {matches.length > 0 && (
                    <button
                      onClick={() => setView("matches")}
                      className="w-full py-3 bg-pink-500 text-white rounded-full font-semibold shadow-md hover:bg-pink-600 transition-colors"
                    >
                      View Matches ({matches.length})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      )}
      {view === "matches" && (
        <MatchedUsers matches={matches} setView={setView} />
      )}
      {activeMatch && <Matched activeMatch={activeMatch} setActiveMatch={setActiveMatch} setView={setView} />}
    </div>
  );
}

export default Swipe;
