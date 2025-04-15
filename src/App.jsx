import { useState } from 'react'
import './App.css'
import './components/QuizQuestion.css'
import questions from './questions'
import QuizQuestion from './components/QuizQuestion'

// Değerlendirme Formu 1: React-Vite kullanımı ve proje yapısı
function App() {
  // Ana state yönetimi
  const [isStarted, setIsStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState({
    correct: 0,
    wrong: 0,
    empty: 0
  })
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Quiz'i başlat
  const startQuiz = () => {
    setIsStarted(true)
    setCurrentQuestionIndex(0)
    setScore({ correct: 0, wrong: 0, empty: 0 })
    setShowResults(false)
    setTimeLeft(30)
    setShowOptions(false)
    setSelectedAnswer(null)
    setImageLoaded(false)
  }

  // Timer management
  useEffect(() => {
    let timer;
    if (isStarted && !showResults && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, showResults, timeLeft]);

  // Cevap işleme
  const handleAnswer = (answer, isTimeout) => {
    const currentQuestion = questions[currentQuestionIndex]
    const newScore = { ...score }

    if (isTimeout) {
      newScore.empty += 1
    } else if (answer === currentQuestion.correctAnswer) {
      newScore.correct += 1
    } else {
      newScore.wrong += 1
    }

    setScore(newScore)

    // Son soru kontrolü
    if (currentQuestionIndex === questions.length - 1) {
      setShowResults(true)
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1)
      }, 1500)
    }
  }

  // Süre kontrolü ve otomatik geçiş
  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer('timeout')
      handleAnswer('timeout', true)
    }
  }

  // Başlangıç ekranı
  if (!isStarted) {
    return (
      <div className="start-screen">
        <div className="start-content">
          <h1>Bilgi Yarışması</h1>
          <p className="subtitle">Eğlenceli sorularla bilgini test et!</p>
          
          <div className="info-card">
            <h2>Test Hakkında</h2>
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📝</span>
                <div className="info-text">
                  <h3>Soru Sayısı</h3>
                  <p>10 soru</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <div className="info-text">
                  <h3>Süre</h3>
                  <p>Her soru için 30 saniye</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">👁️</span>
                <div className="info-text">
                  <h3>Şıklar</h3>
                  <p>İlk 4 saniye gizli</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🔄</span>
                <div className="info-text">
                  <h3>İlerleme</h3>
                  <p>Geri dönüş yok</p>
                </div>
              </div>
            </div>
          </div>
          
          <button className="start-button" onClick={startQuiz}>
            Teste Başla
          </button>
        </div>
      </div>
    )
  }

  // Sonuç ekranı
  if (showResults) {
    return (
      <div className="results-screen">
        <h2>Test Sonuçları</h2>
        <div className="score-cards">
          <div className="score-card correct">
            <div className="score-icon">✓</div>
            <h3>Doğru</h3>
            <div className="score-value">{score.correct}</div>
          </div>
          <div className="score-card wrong">
            <div className="score-icon">✗</div>
            <h3>Yanlış</h3>
            <div className="score-value">{score.wrong}</div>
          </div>
          <div className="score-card empty">
            <div className="score-icon">○</div>
            <h3>Boş</h3>
            <div className="score-value">{score.empty}</div>
          </div>
        </div>
        <button className="restart-button" onClick={startQuiz}>
          Tekrar Dene
        </button>
      </div>
    )
  }

  // Quiz ekranı
  return (
    <div className="quiz-container">
      <QuizQuestion
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        timeLeft={timeLeft}
        isTransitioning={isTransitioning}
        imageLoaded={imageLoaded}
        setImageLoaded={setImageLoaded}
      />
    </div>
  )
}

export default App
