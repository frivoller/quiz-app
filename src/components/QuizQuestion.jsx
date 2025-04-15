import { useState, useEffect, useRef } from 'react'
import './QuizQuestion.css'

// Evaluation Form 2: Component that handles individual quiz questions and their lifecycle
function QuizQuestion({ question, onAnswer }) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const transitionTimeout = useRef(null)

  // Timer and options visibility management
  useEffect(() => {
    if (!question) return

    setTimeLeft(30)
    setShowOptions(false)
    setSelectedOption(null)
    setImageLoaded(false)

    // Şıkları 4 saniye sonra göster
    const optionsTimer = setTimeout(() => {
      setShowOptions(true)
    }, 4000)

    // Geri sayım
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowOptions(false) // Şıklar süre bitince de gizli kalsın
          // 0.7sn sonra yeni soruya geç
          transitionTimeout.current = setTimeout(() => {
            onAnswer(null, true)
          }, 700)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(optionsTimer)
      clearInterval(timer)
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current)
    }
  }, [question])

  // Şık seçimi
  const handleOptionClick = (option) => {
    if (selectedOption) return
    setSelectedOption(option)
    setShowOptions(false) // Şıklar seçildikten sonra tekrar görünmesin
    // 0.7sn sonra yeni soruya geç
    transitionTimeout.current = setTimeout(() => {
      onAnswer(option, false)
    }, 700)
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
        {showOptions && question.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${
              selectedOption === option ? 'selected' : ''
            }`}
            onClick={() => handleOptionClick(option)}
            disabled={!!selectedOption}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuizQuestion 
