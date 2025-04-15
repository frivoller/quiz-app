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
    let timer;
    let optionsTimer;

    const startTimers = () => {
      // Reset timers
      clearInterval(timer);
      clearTimeout(optionsTimer);
      
      // Reset states
      setTimeLeft(30);
      setShowOptions(false);

      // Start options timer (4 seconds)
      optionsTimer = setTimeout(() => {
        setShowOptions(true);
      }, 4000);

      // Start main timer (30 seconds)
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    if (isStarted && !isFinished && !selectedAnswer) {
      startTimers();
    }

    return () => {
      clearInterval(timer);
      clearTimeout(optionsTimer);
    };
  }, [isStarted, currentQuestionIndex, isFinished, selectedAnswer]);

  // Değerlendirme Formu 5: Kullanıcı etkileşimi ve cevap kontrolü
  const handleAnswerClick = (selectedOption) => {
    if (selectedAnswer !== null) return;

    const isAnswerCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    setSelectedAnswer(selectedOption);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }

    setAnswers(prev => [...prev, {
      question: questions[currentQuestionIndex].question,
      selectedAnswer: selectedOption,
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      isCorrect: isAnswerCorrect,
      timeSpent: 30 - timeLeft
    }]);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(30);
        setShowOptions(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setImageLoaded(false);
      } else {
        setIsFinished(true);
        setShowScore(true);
      }
    }, 1500);
  };

  // Değerlendirme Formu 6: Süre kontrolü ve otomatik geçiş
  const handleTimeUp = () => {
    if (selectedAnswer === null && !isFinished) {
      setSelectedAnswer('timeout');
      setIsCorrect(false);

      setAnswers(prev => [...prev, {
        question: questions[currentQuestionIndex].question,
        selectedAnswer: null,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        isCorrect: false,
        timeSpent: 30,
        isTimeout: true
      }]);

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setTimeLeft(30);
          setShowOptions(false);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setImageLoaded(false);
        } else {
          setIsFinished(true);
          setShowScore(true);
        }
      }, 1500);
    }
  };

  // Değerlendirme Formu 7: Kullanıcı arayüzü ve sonuç ekranı
  const renderQuestion = () => {
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
                  <span className="info-icon">📊</span>
                  <div className="info-text">
                    <h3>Sonuç</h3>
                    <p>Detaylı skor raporu</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="start-button" onClick={handleStartQuiz}>
              Teste Başla
            </button>
          </div>
        </div>
      );
    }

    // Sonuç ekranı
    if (showScore) {
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const wrongAnswers = answers.filter(a => !a.isCorrect && !a.isTimeout).length;
      const emptyAnswers = answers.filter(a => a.isTimeout).length;

      return (
        <div className="results-screen">
          <h2>Test Sonuçları</h2>
          <div className="score-cards">
            <div className="score-card correct">
              <div className="score-icon">✓</div>
              <h3>Doğru</h3>
              <div className="score-value">{correctAnswers}</div>
            </div>
            <div className="score-card wrong">
              <div className="score-icon">✗</div>
              <h3>Yanlış</h3>
              <div className="score-value">{wrongAnswers}</div>
            </div>
            <div className="score-card empty">
              <div className="score-icon">○</div>
              <h3>Boş</h3>
              <div className="score-value">{emptyAnswers}</div>
            </div>
          </div>
          <button className="restart-button" onClick={handleStartQuiz}>
            Tekrar Dene
          </button>
        </div>
      );
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
          {showOptions && (
            <div className="options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className="option-button"
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
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
