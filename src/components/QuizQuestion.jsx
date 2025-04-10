import { useState, useEffect } from 'react'

function QuizQuestion({ question, onAnswer, timeLimit = 30 }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [showOptions, setShowOptions] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Her yeni soru için süreyi ve şık görünürlüğünü sıfırla
  useEffect(() => {
    setTimeLeft(timeLimit)
    setShowOptions(false)
    setIsTransitioning(false)

    // 4 saniye sonra seçenekleri göster
    const optionsTimer = setTimeout(() => {
      setShowOptions(true)
    }, 4000)

    // Süre sayacı
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null) // Süre dolduğunda boş cevap gönder
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(optionsTimer)
      clearInterval(timer)
    }
  }, [question.question, timeLimit]) // onAnswer'ı dependency'den çıkardık

  const handleAnswer = (answer) => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setShowOptions(false)
      // Kısa bir gecikme ile cevabı gönder
      setTimeout(() => {
        onAnswer(answer)
      }, 100)
    }
  }

  return (
    <div className="question-container">
      <div className="timer">Kalan Süre: {timeLeft} saniye</div>
      <h2>{question.question}</h2>
      {question.image && (
        <img src={question.image} alt="Soru görseli" className="question-image" />
      )}
      <div className={`options ${showOptions ? 'visible' : ''}`}>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="option-button"
            disabled={!showOptions || isTransitioning}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuizQuestion 