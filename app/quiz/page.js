"use client";

import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/supabaseClient';

export default function QuizPage() {
  const router = useRouter();

  // State hooks
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Confetti and card refs
  const cardRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Fetch quiz questions from supabase
    const fetchAllQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*');
      if (error) console.error(error);
      else setAllQuestions(data);
    };
    fetchAllQuestions();

    // Track window size for confetti
    function updateSize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const quizData = allQuestions[currentIndex];

  // Congratulatory data based on score ranges
  const congratsData = [
    {
      min: 0,
      max: 5,
      title: "Early Block Miner",
      message: "Early blocks mined. Retry to finalise your knowledge.",
    },
    {
      min: 6,
      max: 11,
      title: "Cysic Builder",
      message: "Good progress! Keep building your Cysic knowledge proofs.",
      // img: "/images/Flower-profile.png"
    },
    {
      min: 12,
      max: 14,
      title: "Almost zk-Perfect",
      message: "Almost zk-perfect! One step to full Cysic mastery.",
    },
    {
      min: 15,
      max: 15,
      title: "Zk-Champion",
      message: "Flawless proof! You’re a true Cysic zk-champion",
    }
  ];

  const userCongrats = congratsData.find(d => score >= d.min && score <= d.max) || congratsData[0];

  // Check answer handler
  const checkAnswer = async () => {
    if (selectedOption === null) {
      setErrorMessage("Please select an option before checking your answer.");
      return;
    }
    setErrorMessage("");
    if (!quizData) return;

    const correct = selectedOption === quizData.correct_option;
    setIsCorrect(correct);
    setShowExplanation(true);
    setShowAnswers(true);

    if (correct) {
      setScore(prev => prev + 1);
    }

    const { error } = await supabase
      .from('quiz_attempts')
      .insert([{ question_id: quizData.id, is_correct: correct }]);

    if (error) {
      console.error("Error recording attempt:", error);
    }
  };

  // Navigation handlers
  const nextQuestion = () => {
    if (currentIndex + 1 >= allQuestions.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      resetState();
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetState();
    }
  };

  const resetState = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setIsCorrect(null);
    setShowAnswers(false);
    setErrorMessage("");
  };

  const shareOnX = () => {
    const text = encodeURIComponent(`I scored ${score} on the Cysic Quiz! ${userCongrats.title} 🏆 #CysicQuiz`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const retakeQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    resetState();
  };

  const exitQuiz = () => router.push('/');

  // Render loading
  if (allQuestions.length === 0) {
    return <p className="text-white">Loading...</p>;
  }

  // Render congratulation page
  if (isFinished) {
    return (
      <>
        <Confetti width={windowSize.width} height={windowSize.height} />
        <main className="min-h-screen font-space-grotesk bg-black text-white flex items-center justify-center p-4">
          <div
            ref={cardRef}
            className="bg-gray-900 rounded-3xl p-8 max-w-md w-full text-center shadow-lg flex flex-col items-center"
          >
            <h1 className="text-4xl font-extrabold mb-4 text-green-400">
             Congratulations!
            </h1>
            <h2 className="text-2xl font-bold mb-2">{userCongrats.title}</h2>
            <p className="text-lg mb-6">{userCongrats.message}</p>
            <p className="text-xl font-semibold mb-4">
              You scored {score} out of {allQuestions.length}.
            </p>

            <div className="flex flex-col sm:flex-row justify-between gap-3 w-full">
  <button
    onClick={retakeQuiz}
    className="flex-1 bg-cyan-700 hover:bg-cyan-800 px-3 py-2 rounded text-white text-sm font-semibold text-center"
  >
    Retake Quiz
  </button>
  <button
    onClick={shareOnX}
    className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white text-sm font-semibold text-center"
  >
    Share on X
  </button>
  <button
    onClick={exitQuiz}
    className="flex-1 bg-gray-700 hover:bg-red-800 px-3 py-2 rounded text-white text-sm font-semibold text-center"
  >
    Exit
  </button>
</div>
          </div>
        </main>
      </>
    );
  }

  // Render main quiz page
  return (
    <main className="min-h-screen font-space-grotesk bg-black text-white flex flex-col items-center justify-center p-6">

      {/* Scoreboard */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-400">Score: {score} / {allQuestions.length}</p>
      </div>

      {/* Question Card */}
      <div className="relative bg-gray-900 rounded-4xl p-6 w-full max-w-md shadow-lg mb-6">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-gray-300 text-xs px-4 py-1 rounded-full">
          Question {currentIndex + 1} of {allQuestions.length}
        </div>

        <h2 className="text-xl text-justify mb-3 text-center">{quizData.summary}</h2>
        <p className="text-l mb-5 text-center font-bold text-cyan-400 uppercase">{quizData.question}</p>

        <div className="space-y-2">
          {quizData.options.map((opt, idx) => {
            let optionClass = 'bg-gray-800 border-gray-700';

            if (showAnswers) {
              if (idx === quizData.correct_option) {
                optionClass = 'border-green-500 bg-gray-800';
              } else {
                optionClass = 'border-red-500 bg-gray-800';
              }
            } else if (selectedOption === idx) {
              optionClass = 'bg-cyan-600 border-cyan-400';
            }

            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedOption(idx);
                  setErrorMessage("");
                }}
                disabled={showAnswers}
                className={`block w-full px-4 py-2 rounded border text-left ${optionClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Error message if no option selected */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="bg-cyan-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
          >
            {'<< '}Prev
          </button>

          <button
            onClick={checkAnswer}
            disabled={showAnswers}
            className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-semibold"
          >
            Check Answer
          </button>

          <button
            onClick={nextQuestion}
            disabled={!showAnswers}
            className="bg-cyan-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
          >
            {currentIndex + 1 === allQuestions.length ? 'Submit' : 'Next >>'}
          </button>
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mt-6 bg-gray-900 p-4 rounded mb-4 w-full max-w-md">
          <p className="mb-2">{isCorrect ? "✅ Correct!" : "❌ Wrong."}</p>
          <p className="text-sm text-green-400">💡: {quizData.explanation}</p>
        </div>
      )}

    </main>
  );
}
