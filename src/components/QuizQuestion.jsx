import { useState, useEffect, useRef } from 'react'
import './QuizQuestion.css'

// Evaluation Form 2: Component that handles individual quiz questions and their lifecycle
function QuizQuestion({ question, onAnswer }) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const transitionTimeout = useRef(null)
  const timerRef = useRef(null)
  const optionsTimerRef = useRef(null)

  // Timer and options visibility management
  useEffect(() => {
    if (!question) return

    setTimeLeft(30)
    setShowOptions(false)
    setSelectedOption(null)
    setImageLoaded(false)

    // Şıkları 4 saniye sonra göster
    optionsTimerRef.current = setTimeout(() => {
      setShowOptions(true)
    }, 4000)

    // Geri sayım
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setShowOptions(false)
          onAnswer(null, true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(optionsTimerRef.current)
      clearInterval(timerRef.current)
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current)
    }
  }, [question])

  // Şık seçimi
  const handleOptionClick = (option) => {
    if (selectedOption) return
    setSelectedOption(option)
    setShowOptions(false)
    // Tüm zamanlayıcıları temizle
    clearTimeout(optionsTimerRef.current)
    clearInterval(timerRef.current)
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current)
    // Hemen yeni soruya geç
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
