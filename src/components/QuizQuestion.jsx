import { useState, useEffect } from 'react'
import './QuizQuestion.css'

// Evaluation Form 2: Component that handles individual quiz questions and their lifecycle
function QuizQuestion({ question, onAnswer }) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Timer and options visibility management
  useEffect(() => {
    if (!question) return

    setTimeLeft(30)
    setShowOptions(false)
    setSelectedOption(null)
    setImageLoaded(false)

    // Show options after 3 seconds
    const optionsTimer = setTimeout(() => {
      setShowOptions(true)
    }, 3000)

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onAnswer(null, true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(optionsTimer)
      clearInterval(timer)
    }
  }, [question])

  // Handle option selection
  const handleOptionClick = (option) => {
    if (selectedOption) return
    setSelectedOption(option)
    onAnswer(option, false)
  }

  if (!question) return null

  return (
    <div className="question-container">
      <div className="question-header">
        <div className="question-counter">
          Question {question.index + 1}/{question.total}
        </div>
        <div className="timer">
          Time Left: {timeLeft} seconds
        </div>
      </div>

      <div className="question-content">
        {question.media && (
          <img
            className={`question-image ${imageLoaded ? 'loaded' : ''}`}
            src={question.media}
            alt="Question image"
            onLoad={() => setImageLoaded(true)}
          />
        )}
        <div className="question-text">
          {question.question}
        </div>
      </div>

      <div className={`options ${showOptions ? 'visible' : ''}`}>
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedOption === option ? 'selected' : ''
            }`}
            onClick={() => handleOptionClick(option)}
            disabled={!showOptions || selectedOption}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuizQuestion 
