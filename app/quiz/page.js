"use client";

import { useState, useEffect } from 'react'
import { supabase } from '@/src/supabaseClient'

export default function QuizPage() {
  const [allQuestions, setAllQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const quizData = allQuestions[currentIndex]
  const [scoreData, setScoreData] = useState({ total: 0, correct: 0 });


  const fetchScore = async () => {
    const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')

    if (error) {
      console.error("Error fetching score:", error)
      return;
    }
    const total = data.length;
    const correct = data.filter(attempt => attempt.is_correct).length;
    setScoreData({ total, correct });
    console.log("Score data:", { total, correct });
  };

  useEffect(() => {
    const fetchAllQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        // .limit(1)

    console.log("Fetched data:", data)
    console.log("Fetch error:", error)

      if (error) console.error(error)
      else setAllQuestions(data)
    }

    fetchAllQuestions()
    fetchScore() // Fetch initial score data
  }, []);

  // const quizData = allQuestions[currentIndex]
// check answer function
  const checkAnswer = async () => {
    if (!quizData || selectedOption === null) return
    const correct = selectedOption === quizData.correct_option
    setIsCorrect(correct)
    setShowExplanation(true)

    // record attempt in supabase
    const {data, error } = await supabase
    .from('quiz_attempts')
    .insert([
      {
      question_id: quizData.id,
      is_correct: correct,
      // user_id: null, // if anonymous for now
      }
    ])
    .select()
    if (error) {
      console.error("Error recording attempt:", error)
    } else {
      console.log("Attempt recorded:", data)
    }
    await fetchScore() // fetch updated score after recording attempt
    
  }

  // if (!quizData) return <p className="text-white">Loading... add quiz data</p>
  if(allQuestions.length == 0) return <p className="text-white">Loading...</p>
  if (!quizData) return <p className="text-white">No question at this index</p>

  const nextQuestion = () => {
    const nextIndex = (currentIndex + 1) % allQuestions.length
    setCurrentIndex(nextIndex)
    setSelectedOption(null)
    setShowExplanation(false)
    setIsCorrect(null)
  };
  const prevQuestion = () => {
    const prevIndex = (currentIndex - 1 + allQuestions.length) % allQuestions.length
    setCurrentIndex(prevIndex)  
    setSelectedOption(null)
    setShowExplanation(false) 
    setIsCorrect(null)
  };

  return (
    <main className="min-h-screen font-space-grotesk bg-black text-white flex flex-col items-center justify-center p-6">
      
      {/* <h1 className="text-3xl font-bold mb-6 text-cyan-400">CYSIC QUIZ</h1> */}
      {/* <p className="text-lg text-center mb-8 text-cyan-300">
  Read quick summaries about Cysic, quiz yourself instantly to lock in the knowledge.
</p> */}
      {/* question card section  */}

      <div className="relative bg-gray-900 rounded-4xl p-6 w-full max-w-md shadow-lg mb-6">

  {/* 🏷️ Question Counter Badge */}
<div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-gray-300 text-xs px-4 py-1 rounded-full">
  Question {currentIndex + 1} of {allQuestions.length}
</div>

<h2 className="text-xl text-justify mb-3 text-center">{quizData.summary}</h2>
<p className="text-l mb-5 text-center font-bold text-cyan-400 uppercase">{quizData.question}</p>


  <div className="space-y-2">
    {quizData.options.map((opt, idx) => (
      <button
        key={idx}
        onClick={() => setSelectedOption(idx)}
        className={`block w-full px-4 py-2 rounded border text-left
          ${selectedOption === idx ? 'bg-cyan-600 border-cyan-400' : 'bg-gray-800 border-gray-700'}
        `}
      >
        {opt}
      </button>
    ))}
  </div>

  
    <div className="flex justify-center space-x-4 mt-6">
  <button
    onClick={prevQuestion}
    className="bg-cyan-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
  >
    {'<< '}Prev
  </button>

  <button
    onClick={checkAnswer}
    disabled={selectedOption === null}
    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-semibold"
  >
    Check Answer
  </button>

  <button
    onClick={nextQuestion}
    className="bg-cyan-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
  >
    Next {' >>'}
  </button>
</div>


</div> 
{/* // end */}

{/* // check answer button and explanation section */}


     

      {showExplanation && (
        <div className="mt-6 bg-gray-900 p-4 rounded p-4 mb-4 w-full max-w-md">
          <p className="mb-2">
            {isCorrect ? "✅ Correct!" : "❌ Wrong."}
          </p>

          <p className="text-sm text-green-400">
            💡: {quizData.explanation}
          </p>
        </div>
      )}

     

    </main>
  );
}
