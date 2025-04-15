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
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Değerlendirme Formu 3: Test başlatma ve bilgilendirme ekranı
  const handleStartQuiz = () => {
    setIsStarted(true)
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowScore(false)
    setTimeLeft(30)
    setShowOptions(false)
    setSelectedAnswer(null)
    setImageLoaded(false)
  }

  // Timer management
  useEffect(() => {
    let timer;
    if (isStarted && !showScore && timeLeft > 0) {
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
  }, [isStarted, showScore, timeLeft]);

  // Değerlendirme Formu 5: Kullanıcı etkileşimi ve cevap kontrolü
  const handleAnswerClick = (selectedOption) => {
    if (selectedAnswer !== null) return;

    const isAnswerCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    setSelectedAnswer(selectedOption);

    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(30);
        setShowOptions(false);
        setSelectedAnswer(null);
        setImageLoaded(false);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  // Süre kontrolü ve otomatik geçiş
  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer('timeout');
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setTimeLeft(30);
          setShowOptions(false);
          setSelectedAnswer(null);
          setImageLoaded(false);
        } else {
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
      const correctAnswers = score;
      const wrongAnswers = currentQuestionIndex - score;
      const emptyAnswers = questions.length - currentQuestionIndex;

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

    const currentQuestion = questions[currentQuestionIndex];
    return (
      <QuizQuestion
        currentQuestion={currentQuestion}
        options={currentQuestion.options}
        onAnswer={handleAnswerClick}
        timeLeft={timeLeft}
        isTransitioning={isTransitioning}
        imageLoaded={imageLoaded}
        setImageLoaded={setImageLoaded}
      />
    );
  }

  // Değerlendirme Formu 8: Responsive tasarım (1400px)
  return (
    <div className="app-container">
      {renderQuestion()}
    </div>
  )
}

export default App
