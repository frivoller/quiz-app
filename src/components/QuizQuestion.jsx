import { useState, useEffect } from 'react'
import './QuizQuestion.css'

function QuizQuestion({ currentQuestion, onAnswer }) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Zamanlayıcı ve seçeneklerin görünürlüğünü yönetme
  useEffect(() => {
    setTimeLeft(30)
    setShowOptions(false)
    setSelectedOption(null)
    setImageLoaded(false)

    // Seçenekleri 3 saniye sonra göster
    const optionsTimer = setTimeout(() => {
      setShowOptions(true)
    }, 3000)

    // Zamanlayıcıyı başlat
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
  }, [currentQuestion.question])

  const handleOptionClick = (option) => {
    if (selectedOption) return
    setSelectedOption(option)
    onAnswer(option, false)
  }

  return (
    <div className="question-container">
      <div className="question-header">
        <div className="question-counter">
          Soru {currentQuestion.index + 1}/{currentQuestion.total}
        </div>
        <div className="timer">
          Kalan Süre: {timeLeft} saniye
        </div>
      </div>

      <div className="question-content">
        {currentQuestion.media && (
          <img
            className="question-image"
            src={currentQuestion.media}
            alt="Soru görseli"
            onLoad={() => setImageLoaded(true)}
          />
        )}
        <div className="question-text">
          {currentQuestion.question}
        </div>
      </div>

      <div className={`options ${showOptions ? 'visible' : ''}`}>
        {currentQuestion.options.map((option, index) => (
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
