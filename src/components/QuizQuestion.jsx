import { useState, useEffect } from 'react'

// Evaluation Form 2: Component that handles individual quiz questions and their lifecycle
function QuizQuestion({ question, onAnswer, timeLimit = 30 }) {
  // State management for timer, options visibility and transitions
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [showOptions, setShowOptions] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [optionsTimer, setOptionsTimer] = useState(4)

  // Evaluation Form 4: Timer and option display management
  useEffect(() => {
    // Reset states for new question
    setTimeLeft(timeLimit)
    setShowOptions(false)
    setIsTransitioning(false)
    setOptionsTimer(4)

    // Options timer countdown
    const optionsCountdown = setInterval(() => {
      setOptionsTimer((prev) => {
        if (prev <= 1) {
          clearInterval(optionsCountdown)
          setShowOptions(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Main timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null) // Send empty answer when time runs out
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup timers on component unmount or question change
    return () => {
      clearInterval(timer)
      clearInterval(optionsCountdown)
    }
  }, [question.question, timeLimit])

  // Evaluation Form 5: Handle user answer selection
  const handleAnswer = (answer) => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setShowOptions(false)
      // Short delay before sending answer
      setTimeout(() => {
        onAnswer(answer)
      }, 100)
    }
  }

  // Evaluation Form 7: Question UI rendering with modern design
  return (
    <div className="question-container">
      <div className="timer">Kalan Süre: {timeLeft}s</div>
      <h2>{question.question}</h2>
      {question.image && (
        <img 
          src={question.image} 
          alt="Question visual" 
          className="question-image"
        />
      )}
      {showOptions && (
        <div className="options visible">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="option-button"
              disabled={isTransitioning}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuizQuestion 
