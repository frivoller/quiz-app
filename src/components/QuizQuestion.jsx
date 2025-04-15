import React, { useState, useEffect } from 'react'
import './QuizQuestion.css'

// Props for the component
const QuizQuestion = ({ 
  question, 
  options, 
  onAnswer, 
  timeLeft, 
  isTransitioning,
  imageLoaded,
  setImageLoaded
}) => {
  // State management for timer, options visibility and transitions
  const [showOptions, setShowOptions] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  // Reset states when question changes
  useEffect(() => {
    setShowOptions(false)
    setSelectedAnswer(null)
    
    // Show options after 4 seconds
    const optionsTimer = setTimeout(() => {
      setShowOptions(true)
    }, 4000)

    return () => clearTimeout(optionsTimer)
  }, [question])

  // Handle answer selection
  const handleAnswerClick = (option) => {
    if (!showOptions || selectedAnswer !== null) return
    
    setSelectedAnswer(option)
    onAnswer(option)
  }

  return (
    <div className={`question-container ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="question-header">
        <div className="question-counter">
          Question {question.index + 1} / {question.total}
        </div>
        <div className="timer">
          Time Left: {timeLeft} seconds
        </div>
      </div>
      
      <div className="question-content">
        <div className="question-image-container">
          <img 
            src={question.media} 
            alt="Question"
            className={`question-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <h2 className="question-text">{question.question}</h2>
        
        <div className={`options ${showOptions ? 'visible' : ''}`}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizQuestion 
