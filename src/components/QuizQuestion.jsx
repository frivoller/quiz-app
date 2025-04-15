import { useState, useEffect } from 'react'
import './QuizQuestion.css'

const QuizQuestion = ({ question, onAnswer }) => {
  // State yönetimi
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Timer yönetimi
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!selectedAnswer) {
            onAnswer(null, true)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onAnswer, selectedAnswer])

  // Şıkları gösterme zamanlayıcısı
  useEffect(() => {
    const optionsTimer = setTimeout(() => {
      setShowOptions(true)
    }, 4000)

    return () => clearTimeout(optionsTimer)
  }, [question])

  // Soru değiştiğinde state'leri sıfırla
  useEffect(() => {
    setTimeLeft(30)
    setShowOptions(false)
    setSelectedAnswer(null)
    setImageLoaded(false)
  }, [question])

  // Cevap seçme
  const handleAnswerClick = (answer) => {
    if (!showOptions || selectedAnswer) return
    
    setSelectedAnswer(answer)
    onAnswer(answer, false)
  }

  return (
    <div className="question-container">
      <div className="question-header">
        <div className="question-counter">
          Soru {question.index + 1} / {question.total}
        </div>
        <div className="timer">
          Kalan Süre: {timeLeft} saniye
        </div>
      </div>
      
      <div className="question-content">
        {question.media && (
          <div className="question-image-container">
            <img 
              src={question.media}
              alt="Soru görseli"
              className={`question-image ${imageLoaded ? 'loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}
        
        <h2 className="question-text">{question.question}</h2>
        
        <div className={`options ${showOptions ? 'visible' : ''}`}>
          {question.options.map((option, index) => (
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
