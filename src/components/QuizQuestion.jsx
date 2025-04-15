import React, { useState, useEffect } from 'react'
import './QuizQuestion.css'

// Props for the component
const QuizQuestion = ({ 
  currentQuestion, 
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
    setImageLoaded(false)
    
    // Show options after 4 seconds
    const optionsTimer = setTimeout(() => {
      setShowOptions(true)
    }, 4000)

    return () => clearTimeout(optionsTimer)
  }, [currentQuestion, setImageLoaded])

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
          Soru {currentQuestion.index + 1} / {currentQuestion.total}
        </div>
        <div className="timer">
          Kalan Süre: {timeLeft} saniye
        </div>
      </div>
      
      <div className="question-content">
        {currentQuestion.media && (
          <div className="question-image-container">
            <img 
              src={currentQuestion.media} 
              alt="Soru görseli"
              className={`question-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}
        
        <h2 className="question-text">{currentQuestion.question}</h2>
        
        <div className={`options ${showOptions ? 'visible' : ''}`}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(option)}
              className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
              disabled={selectedAnswer !== null || !showOptions}
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
