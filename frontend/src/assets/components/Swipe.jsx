import React from "react";
import TinderCard from "react-tinder-card";
import { useState, useRef } from "react";

const iprofiles = [
  {
    id: "1",
    name: "Ayesha",
    age: 22,
    city: "Mumbai",
    bio: "Coffee & Code ☕",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    name: "Rahul",
    age: 24,
    city: "Delhi",
    bio: "Weekend guitarist 🎸",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    name: "Priya",
    age: 23,
    city: "Bangalore",
    bio: "Looking for a hackathon partner!",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
];

function Swipe() {

  const [profiles, setProfiles] = useState(iprofiles);

  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  const [isDragging, setIsDragging] = useState(false);

  const [decision, setDecision] = useState("");

  const startPosition = useRef({
    x: 0,
    y: 0
  });

  const currentPosition = useRef({
    x: 0,
    y: 0
  });

  const cardRef = useRef(null);

  const SWIPE_THRESHOLD = 120;

  // 1. Start dragging
  const handlePointerDown = (e) => {

    if (decision) return;

    e.preventDefault();

    cardRef.current.setPointerCapture(e.pointerId);

    setIsDragging(true);

    startPosition.current = {
      x: e.clientX - currentPosition.current.x,
      y: e.clientY - currentPosition.current.y
    };

  };

  // 2. Move the card
  const handlePointerMove = (e) => {

    if (!isDragging || decision) return;

    const newPosition = {
      x: e.clientX - startPosition.current.x,
      y: e.clientY - startPosition.current.y
    };

    currentPosition.current = newPosition;

    setPosition(newPosition);

  };

  // 3. Remove the card after animation
  const removeCard = () => {

    setProfiles((prev) => prev.slice(0, -1));

    currentPosition.current = {
      x: 0,
      y: 0
    };

    setPosition({
      x: 0,
      y: 0
    });

    setDecision("");

  };

  // 4. Complete the swipe
  const handlePointerUp = () => {

    if (!isDragging) return;

    setIsDragging(false);

    if (position.x > SWIPE_THRESHOLD) {

      setDecision("LIKE");

    } else if (position.x < -SWIPE_THRESHOLD) {

      setDecision("NOPE");

    } else {

      currentPosition.current = {
        x: 0,
        y: 0
      };

      setPosition({
        x: 0,
        y: 0
      });

    }

  };

  // 5. Fly the card away
  const handleTransitionEnd = (e) => {

    if (e.propertyName !== "transform") return;

    if (decision) {

      if (decision === "LIKE") {
        console.log("Profile liked!");
      } else {
        console.log("Profile disliked!");
      }

      removeCard();

    }

  };

  // 6. Like/dislike buttons
  const swipeCard = (direction) => {

    if (decision || profiles.length === 0) return;

    setDecision(direction);

    setIsDragging(false);

  };

  // Calculate card movement
  const currentX = decision
    ? decision === "LIKE" ? 600 : -600
    : position.x;

  const currentY = decision ? position.y : position.y;

  const rotation = currentX * 0.05;

  const opacity = Math.max(
    0.3,
    1 - Math.abs(position.x) / 400
  );

  const topProfile = profiles[profiles.length - 1];

  return (

    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Discover People
      </h1>

      {/* Card container */}
      <div className="relative w-80 h-[450px]">

        {profiles.length > 0 ? (

          profiles.map((person, index) => {

            const isTopCard =
              index === profiles.length - 1;

            return (

              <div
                key={person.id}
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
                style={{
                  zIndex: index,
                  transform: isTopCard
                    ? `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`
                    : `scale(${1 - (profiles.length - 1 - index) * 0.04}) translateY(${(profiles.length - 1 - index) * 10}px)`,
                  opacity: isTopCard ? opacity : 1,
                  transition: isDragging && isTopCard
                    ? "none"
                    : "transform 0.4s ease, opacity 0.4s ease",
                  touchAction: "none",
                  cursor: isTopCard ? "grab" : "default"
                }}

                ref={isTopCard ? cardRef : null}

                onPointerDown={isTopCard ? handlePointerDown : undefined}
                onPointerMove={isTopCard ? handlePointerMove : undefined}
                onPointerUp={isTopCard ? handlePointerUp : undefined}
                onPointerCancel={isTopCard ? handlePointerUp : undefined}
                onTransitionEnd={isTopCard ? handleTransitionEnd : undefined}
              >

                {/* Profile image */}
                <img
                  src={person.photo}
                  alt={person.name}
                  draggable="false"
                  className="w-full h-full object-cover pointer-events-none select-none"
                />

                {/* Gradient and profile details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-0 p-6 text-white pointer-events-none">

                  <h2 className="text-3xl font-bold">
                    {person.name}, {person.age}
                  </h2>

                  <p className="mt-2 text-sm">
                    {person.bio}
                  </p>

                </div>

                {/* LIKE indicator */}
                {isTopCard && position.x > 30 && !decision && (
                  <div className="absolute top-10 left-5 border-4 border-green-400 text-green-400 text-3xl font-bold px-4 py-2 rotate-[-15deg]">
                    LIKE
                  </div>
                )}

                {/* NOPE indicator */}
                {isTopCard && position.x < -30 && !decision && (
                  <div className="absolute top-10 right-5 border-4 border-red-500 text-red-500 text-3xl font-bold px-4 py-2 rotate-[15deg]">
                    NOPE
                  </div>
                )}

              </div>

            );

          })

        ) : (

          <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg">

  

          </div>

        )}

      </div>

      {/* Action buttons */}
      {profiles.length > 0 && (

        <div className="flex gap-8 mt-8">

          <button
            onClick={() => swipeCard("NOPE")}
            className="w-16 h-16 rounded-full bg-white shadow-lg text-red-500 text-3xl"
          >
            ✕
          </button>

          <button
            onClick={() => swipeCard("LIKE")}
            className="w-16 h-16 rounded-full bg-white shadow-lg text-green-500 text-3xl"
          >
            ♥
          </button>

        </div>

      )}

    </div>

  );

}

export default Swipe;