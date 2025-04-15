import { useState, useEffect } from 'react'
import './App.css'
import './components/QuizQuestion.css'
import questions from './questions'
import QuizQuestion from './components/QuizQuestion'

// Evaluation Form 1: React-Vite usage and project structure
function App() {
  // Main state management
  const [isStarted, setIsStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [showOptions, setShowOptions] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Start the quiz
  const startQuiz = () => {
    setIsStarted(true)
    setCurrentQuestionIndex(0)
    setAnswers([])
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

  // Handle answer submission
  const handleAnswer = (answer, isTimeout) => {
    const currentQuestion = questions[currentQuestionIndex]
    const answerData = {
      question: currentQuestion.question,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: answer === currentQuestion.correctAnswer,
      isTimeout: isTimeout
    }
    
    setAnswers(prev => [...prev, answerData])
    moveToNextQuestion()
  }

  // Move to next question or show results
  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  // Süre kontrolü ve otomatik geçiş
  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer('timeout')
      handleAnswer('timeout', true)
    }
  }

  // Calculate statistics
  const calculateStats = () => {
    return answers.reduce((stats, answer) => {
      if (answer.isTimeout) {
        stats.unanswered++
      } else if (answer.isCorrect) {
        stats.correct++
      } else {
        stats.wrong++
      }
      return stats
    }, { correct: 0, wrong: 0, unanswered: 0 })
  }

  // Start screen
  if (!isStarted) {
    return (
      <div className="start-screen">
        <div className="start-content">
          <h1>Knowledge Quiz</h1>
          <p className="subtitle">Test your knowledge with fun questions!</p>
          
          <div className="info-card">
            <h2>About the Quiz</h2>
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📝</span>
                <div className="info-text">
                  <h3>Number of Questions</h3>
                  <p>10 questions</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">⏱️</span>
                <div className="info-text">
                  <h3>Time</h3>
                  <p>30 seconds per question</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">👁️</span>
                <div className="info-text">
                  <h3>Options</h3>
                  <p>Hidden for first 3 seconds</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🔄</span>
                <div className="info-text">
                  <h3>Progress</h3>
                  <p>No going back</p>
                </div>
              </div>
            </div>
          </div>
          
          <button className="start-button" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  // Results screen
  if (showResults) {
    const stats = calculateStats()
    return (
      <div className="results-screen">
        <h2>Quiz Results</h2>
        <div className="score-cards">
          <div className="score-card correct">
            <div className="score-icon">✓</div>
            <h3>Correct</h3>
            <div className="score-value">{stats.correct}</div>
          </div>
          <div className="score-card wrong">
            <div className="score-icon">✗</div>
            <h3>Wrong</h3>
            <div className="score-value">{stats.wrong}</div>
          </div>
          <div className="score-card empty">
            <div className="score-icon">⏱</div>
            <h3>Unanswered</h3>
            <div className="score-value">{stats.unanswered}</div>
          </div>
        </div>

        <div className="answers-review">
          <h3>Detailed Review</h3>
          {answers.map((answer, index) => (
            <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'wrong'}`}>
              <div className="question-number">Question {index + 1}</div>
              <div className="question-text">{answer.question}</div>
              <div className="answer-details">
                {answer.isTimeout ? (
                  <p className="timeout">Time ran out</p>
                ) : (
                  <>
                    <p>Your answer: <span>{answer.userAnswer || 'No answer'}</span></p>
                    <p className="correct-answer">Correct answer: <span>{answer.correctAnswer}</span></p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="restart-button" onClick={startQuiz}>
          Try Again
        </button>
      </div>
    )
  }

  // Quiz screen
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
