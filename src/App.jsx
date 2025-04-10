import { useState, useEffect } from 'react'
import QuizQuestion from './components/QuizQuestion'
import './App.css'
import './components/QuizQuestion.css'

// Soruları buradan import edeceğiz
import questions from './questions'

function App() {
  const [isStarted, setIsStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState({
    correct: 0,
    wrong: 0,
    empty: 0
  })
  const [answers, setAnswers] = useState([])
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    let timer
    let transitionTimer
    let optionsTimer

    if (!isFinished) {
      setShowOptions(false)
      setIsTransitioning(true)
      setImageLoaded(false)
      setTimeLeft(30)

      transitionTimer = setTimeout(() => {
        setIsTransitioning(false)
        optionsTimer = setTimeout(() => {
          setShowOptions(true)
        }, 4000)
      }, 500)

      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            handleTimeUp()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    return () => {
      clearInterval(timer)
      clearTimeout(transitionTimer)
      clearTimeout(optionsTimer)
    }
  }, [currentQuestionIndex, isFinished])

  const handleTimeUp = () => {
    if (!isFinished) {
      const currentQuestion = questions[currentQuestionIndex]
      setAnswers(prev => [...prev, { 
        question: currentQuestion.question,
        userAnswer: null,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: false,
        isTimeout: true
      }])
      setScore(prev => ({ ...prev, empty: prev.empty + 1 }))
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        setIsFinished(true)
      }
    }
  }

  const handleOptionClick = (option) => {
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = option === currentQuestion.correctAnswer
    
    setAnswers(prev => [...prev, {
      question: currentQuestion.question,
      userAnswer: option,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      isTimeout: false
    }])

    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }))
    } else {
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }))
    }

    goToNextQuestion()
  }

  const goToNextQuestion = () => {
    setShowOptions(false)
    setIsTransitioning(true)
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setTimeLeft(30)
      } else {
        setIsFinished(true)
      }
    }, 300)
  }

  const startQuiz = () => {
    setIsStarted(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = (e) => {
    console.error('Image failed to load:', e)
    e.target.src = 'fallback-image.jpg' // Varsayılan bir görsel ekleyebilirsiniz
  }

  if (!isStarted) {
    return (
      <div className="app">
        <div className="start-screen">
          <h1>Quiz Uygulamasına Hoş Geldiniz</h1>
          <div className="info">
            <h2>Test Hakkında Bilgiler:</h2>
            <ul>
              <li>Test toplam 10 sorudan oluşmaktadır</li>
              <li>Her soru için 30 saniye süreniz vardır</li>
              <li>İlk 4 saniye cevap şıkları görünmeyecektir</li>
              <li>Bir soruya cevap verdikten sonra geri dönemezsiniz</li>
              <li>Süre dolduğunda otomatik olarak sonraki soruya geçilir</li>
              <li>Test sonunda tüm cevaplarınızı detaylı olarak görebileceksiniz</li>
            </ul>
          </div>
          <button onClick={() => setIsStarted(true)} className="start-button">
            Teste Başla
          </button>
        </div>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="app">
        <div className="results">
          <h2>Test Tamamlandı!</h2>
          <div className="score-card">
            <div className="score-item correct">
              <span>Doğru</span>
              <span>{score.correct}</span>
            </div>
            <div className="score-item wrong">
              <span>Yanlış</span>
              <span>{score.wrong}</span>
            </div>
            <div className="score-item empty">
              <span>Boş</span>
              <span>{score.empty}</span>
            </div>
          </div>
          <div className="answers-review">
            <h3>Cevaplarınızın Detaylı İncelemesi</h3>
            {answers.map((answer, index) => (
              <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'wrong'}`}>
                <p className="question-number">Soru {index + 1}</p>
                <p className="question-text">{answer.question}</p>
                <div className="answer-details">
                  {answer.isTimeout ? (
                    <>
                      <p className="timeout">Süre Doldu</p>
                      <p className="correct-answer">Doğru Cevap: <span>{answer.correctAnswer}</span></p>
                    </>
                  ) : (
                    <>
                      <p>Sizin Cevabınız: <span>{answer.userAnswer}</span></p>
                      <p>Doğru Cevap: <span>{answer.correctAnswer}</span></p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => window.location.reload()} className="restart-button">
            Yeniden Başla
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="app">
      <div className={`question-container ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="timer">{timeLeft} saniye</div>
        {currentQuestion.image && (
          <img 
            src={currentQuestion.image} 
            alt="Soru görseli"
            className={`question-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        <h2 className="question-text">{currentQuestion.question}</h2>
        <div className={`options ${showOptions ? 'visible' : ''}`}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleOptionClick(option)}
              disabled={!showOptions || isTransitioning}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
