import { useState, useEffect } from 'react'
import './App.css'
import './components/QuizQuestion.css'

// Importing the list of questions
import questions from './questions'

// Değerlendirme Formu 1: React-Vite kullanımı ve proje yapısı
function App() {
  // Değerlendirme Formu 2: State yönetimi ve veri akışı
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Değerlendirme Formu 3: Test başlatma ve bilgilendirme ekranı
  const handleStartQuiz = () => {
    setIsStarted(true)
    setTimeLeft(30)
    setShowOptions(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowScore(false)
    setIsFinished(false)
    setAnswers([])
    setImageLoaded(false)
  }

  // Değerlendirme Formu 4: Zamanlayıcı ve şık gösterimi kontrolü
  useEffect(() => {
    let timer
    let transitionTimer
    let optionsTimer

    if (isStarted && !isFinished) {
      // İlk 4 saniye şıkları gizle
      optionsTimer = setTimeout(() => {
        setShowOptions(true)
      }, 4000)

      // 30 saniyelik soru süresi
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
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
  }, [isStarted, currentQuestionIndex, isFinished])

  // Değerlendirme Formu 5: Kullanıcı etkileşimi ve cevap kontrolü
  const handleAnswerClick = (selectedOption) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(selectedOption)
    const isAnswerCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer
    setIsCorrect(isAnswerCorrect)

    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 1)
    }

    // Cevap geçmişini kaydet
    setAnswers(prev => [...prev, {
      question: questions[currentQuestionIndex].question,
      selectedAnswer: selectedOption,
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      isCorrect: isAnswerCorrect,
      timeSpent: 30 - timeLeft
    }])

    // Sonraki soruya geç
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setTimeLeft(30)
        setShowOptions(false)
        setSelectedAnswer(null)
        setIsCorrect(null)
        setImageLoaded(false)
      } else {
        setIsFinished(true)
        setShowScore(true)
      }
    }, 1500)
  }

  // Değerlendirme Formu 6: Süre kontrolü ve otomatik geçiş
  const handleTimeUp = () => {
    if (selectedAnswer === null && !isFinished) {
      setSelectedAnswer('timeout')
      setIsCorrect(false)

      // Zaman aşımını kaydet
      setAnswers(prev => [...prev, {
        question: questions[currentQuestionIndex].question,
        selectedAnswer: null,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        isCorrect: false,
        timeSpent: 30,
        isTimeout: true
      }])

      // Sonraki soruya geç
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          setTimeLeft(30)
          setShowOptions(false)
          setSelectedAnswer(null)
          setIsCorrect(null)
          setImageLoaded(false)
        } else {
          setIsFinished(true)
          setShowScore(true)
        }
      }, 1500)
    }
  }

  // Değerlendirme Formu 7: Kullanıcı arayüzü ve sonuç ekranı
  const renderQuestion = () => {
    // Başlangıç ekranı
    if (!isStarted) {
      return (
        <div className="start-screen">
          <h1>Quiz App</h1>
          <p>Test your knowledge with our interactive quiz!</p>
          <div className="info">
            <h2>Test Hakkında Bilgiler</h2>
            <ul>
              <li>Test 10 sorudan oluşmaktadır</li>
              <li>Her soru için 30 saniye süreniz var</li>
              <li>İlk 4 saniye cevap şıkları gizli olacaktır</li>
              <li>Geçmiş sorulara dönülemez</li>
              <li>Test sonunda detaylı sonuç raporu alacaksınız</li>
            </ul>
          </div>
          <button onClick={handleStartQuiz}>Teste Başla</button>
        </div>
      )
    }

    // Sonuç ekranı
    if (showScore) {
      return (
        <div className="results-screen">
          <h2>Test Sonuçları</h2>
          <div className="score-summary">
            <p>Toplam Puan: {score} / {questions.length}</p>
            <p>Doğru Cevaplar: {score}</p>
            <p>Yanlış Cevaplar: {questions.length - score}</p>
          </div>
          <div className="answers-list">
            {answers.map((answer, index) => (
              <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'wrong'}`}>
                <h3>Soru {index + 1}</h3>
                <p>{answer.question}</p>
                {answer.isTimeout ? (
                  <>
                    <p className="timeout">Süre Doldu!</p>
                    <p className="correct-answer">Doğru Cevap: <span>{answer.correctAnswer}</span></p>
                  </>
                ) : (
                  <>
                    <p>Sizin Cevabınız: {answer.selectedAnswer}</p>
                    <p>Doğru Cevap: {answer.correctAnswer}</p>
                  </>
                )}
                <p>Harcanan Süre: {answer.timeSpent} saniye</p>
              </div>
            ))}
          </div>
          <button onClick={handleStartQuiz}>Tekrar Dene</button>
        </div>
      )
    }

    // Soru ekranı
    const currentQuestion = questions[currentQuestionIndex]

    return (
      <div className="question-container">
        <div className="question-header">
          <div className="question-counter">
            Soru {currentQuestionIndex + 1} / {questions.length}
          </div>
          <div className="timer">
            Kalan Süre: {timeLeft}s
          </div>
        </div>
        <div className="question-content">
          <img 
            src={currentQuestion.media} 
            alt="Soru görseli"
            className={`question-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
          />
          <h2 className="question-text">{currentQuestion.question}</h2>
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  !showOptions ? 'hidden' : ''
                } ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'correct'
                      : 'wrong'
                    : ''
                } ${
                  selectedAnswer && option === currentQuestion.correctAnswer
                    ? 'correct'
                    : ''
                }`}
                onClick={() => handleAnswerClick(option)}
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

  // Değerlendirme Formu 8: Responsive tasarım (1400px)
  return (
    <div className="app-container">
      {renderQuestion()}
    </div>
  )
}

export default App
