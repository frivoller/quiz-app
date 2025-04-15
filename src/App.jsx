import { useState, useEffect } from 'react'
import './App.css'

// Evaluation form 1: Component structure and organization
function App() {
  // State variables for quiz management
  const [questions, setQuestions] = useState([])
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

  // Evaluation form 2: Data fetching and API integration
  useEffect(() => {
    fetchQuestions()
  }, [])

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple')
      const data = await response.json()
      const formattedQuestions = data.results.map(question => ({
        question: question.question,
        options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
        correctAnswer: question.correct_answer
      }))
      setQuestions(formattedQuestions)
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  // Evaluation form 3: State management and data flow
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
  }

  // Evaluation form 4: Timer implementation
  useEffect(() => {
    let timer
    let transitionTimer
    let optionsTimer

    if (isStarted && !isFinished) {
      // Show options after 4 seconds
      optionsTimer = setTimeout(() => {
        setShowOptions(true)
      }, 4000)

      // Main timer for question
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

  // Evaluation form 5: User interaction handling
  const handleAnswerClick = (selectedOption) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(selectedOption)
    const isAnswerCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer
    setIsCorrect(isAnswerCorrect)

    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 1)
    }

    // Add answer to history
    setAnswers(prev => [...prev, {
      question: questions[currentQuestionIndex].question,
      selectedAnswer: selectedOption,
      correctAnswer: questions[currentQuestionIndex].correctAnswer,
      isCorrect: isAnswerCorrect,
      timeSpent: 30 - timeLeft
    }])

    // Transition to next question after 1.5 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setTimeLeft(30)
        setShowOptions(false)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        setIsFinished(true)
        setShowScore(true)
      }
    }, 1500)
  }

  // Evaluation form 6: Error handling and edge cases
  const handleTimeUp = () => {
    if (selectedAnswer === null && !isFinished) {
      setSelectedAnswer('timeout')
      setIsCorrect(false)

      // Add timeout answer to history
      setAnswers(prev => [...prev, {
        question: questions[currentQuestionIndex].question,
        selectedAnswer: null,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        isCorrect: false,
        timeSpent: 30,
        isTimeout: true
      }])

      // Transition to next question after 1.5 seconds
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          setTimeLeft(30)
          setShowOptions(false)
          setSelectedAnswer(null)
          setIsCorrect(null)
        } else {
          setIsFinished(true)
          setShowScore(true)
        }
      }, 1500)
    }
  }

  // Evaluation form 7: UI rendering and conditional display
  const renderQuestion = () => {
    if (!isStarted) {
      return (
        <div className="start-screen">
          <h1>Quiz App</h1>
          <p>Test your knowledge with our interactive quiz!</p>
          <button onClick={handleStartQuiz}>Start Quiz</button>
        </div>
      )
    }

    if (showScore) {
      return (
        <div className="results-screen">
          <h2>Quiz Results</h2>
          <div className="score-summary">
            <p>Total Score: {score} / {questions.length}</p>
            <p>Correct Answers: {score}</p>
            <p>Wrong Answers: {questions.length - score}</p>
          </div>
          <div className="answers-list">
            {answers.map((answer, index) => (
              <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'wrong'}`}>
                <h3>Question {index + 1}</h3>
                <p>{answer.question}</p>
                {answer.isTimeout ? (
                  <>
                    <p className="timeout">Time's Up!</p>
                    <p className="correct-answer">Correct Answer: <span>{answer.correctAnswer}</span></p>
                  </>
                ) : (
                  <>
                    <p>Your Answer: {answer.selectedAnswer}</p>
                    <p>Correct Answer: {answer.correctAnswer}</p>
                  </>
                )}
                <p>Time Spent: {answer.timeSpent} seconds</p>
              </div>
            ))}
          </div>
          <button onClick={handleStartQuiz}>Try Again</button>
        </div>
      )
    }

    const currentQuestion = questions[currentQuestionIndex]

    return (
      <div className="question-container">
        <div className="question-header">
          <div className="question-counter">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="timer">
            Time Left: {timeLeft}s
          </div>
        </div>
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
    )
  }

  return (
    <div className="app-container">
      {renderQuestion()}
    </div>
  )
}

export default App
