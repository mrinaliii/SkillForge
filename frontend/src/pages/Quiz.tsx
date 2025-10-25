import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockSkills } from '../data/mockData';
import { ArrowLeft, Clock, Share2 } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: 'What hook is used to manage side effects in React?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 1
  },
  {
    id: 2,
    question: 'Which method is used to update state in a class component?',
    options: ['this.state = newState', 'this.setState()', 'this.updateState()', 'this.changeState()'],
    correctAnswer: 1
  },
  {
    id: 3,
    question: 'What does JSX stand for?',
    options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'Java XML'],
    correctAnswer: 0
  },
  {
    id: 4,
    question: 'Which hook would you use to access context?',
    code: 'const value = use______(MyContext);',
    options: ['useContext', 'useState', 'useEffect', 'useRef'],
    correctAnswer: 0
  },
  {
    id: 5,
    question: 'How do you pass data from parent to child component?',
    options: ['Through state', 'Through props', 'Through context', 'Through refs'],
    correctAnswer: 1
  },
  {
    id: 6,
    question: 'What is the virtual DOM?',
    options: [
      'A copy of the browser DOM',
      'A lightweight representation of the DOM',
      'A database for React',
      'A testing environment'
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: 'Which lifecycle method runs after component mounts?',
    options: ['componentWillMount', 'componentDidMount', 'componentWillUpdate', 'render'],
    correctAnswer: 1
  },
  {
    id: 8,
    question: 'What does the key prop do in React lists?',
    options: [
      'Encrypts the data',
      'Helps React identify which items have changed',
      'Sorts the list',
      'Validates the data'
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: 'How do you prevent default form submission?',
    options: ['e.preventDefault()', 'e.stopPropagation()', 'return false', 'e.cancel()'],
    correctAnswer: 0
  },
  {
    id: 10,
    question: 'What is a higher-order component?',
    options: [
      'A component with high priority',
      'A function that takes a component and returns a new component',
      'A component at the top of the tree',
      'A component with many props'
    ],
    correctAnswer: 1
  }
];

const Quiz = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const skill = mockSkills.find(s => s.id === skillId);

  if (!skill) {
    return (
      <div className="text-center py-12">
        <p className="text-xl opacity-60">Skill not found</p>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (!submitted) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setSubmitted(true);

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setSubmitted(false);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleSkip = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
    }
  };

  const calculateScore = () => {
    const correct = answers.filter((answer, index) => answer === quizQuestions[index].correctAnswer).length;
    return { correct, total: quizQuestions.length, percentage: Math.round((correct / quizQuestions.length) * 100) };
  };

  if (showResults) {
    const score = calculateScore();
    const oldRetention = skill.retention;
    const boost = Math.round(score.percentage * 0.15);
    const newRetention = Math.min(100, oldRetention + boost);

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
        <div
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background: score.percentage >= 80
              ? 'linear-gradient(135deg, var(--success) 0%, #059669 100%)'
              : score.percentage >= 60
              ? 'linear-gradient(135deg, var(--warning) 0%, #d97706 100%)'
              : 'linear-gradient(135deg, var(--danger) 0%, #dc2626 100%)'
          }}
        >
          {score.percentage >= 80 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}

          <div className="relative z-10">
            <span className="text-6xl mb-4 block">
              {score.percentage >= 80 ? '🎉' : score.percentage >= 60 ? '👍' : '💪'}
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">
              {score.percentage >= 80 ? 'Excellent Work!' : score.percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-white/80 mb-6">
              You scored {score.correct} out of {score.total} questions
            </p>

            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-7xl font-bold text-white">{score.percentage}%</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h3 className="text-xl font-bold mb-4">Retention Update</h3>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm opacity-60 mb-1">Before</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>{oldRetention}%</p>
            </div>
            <div className="flex-1 mx-8">
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
                <div
                  className="h-full transition-all duration-1000"
                  style={{
                    width: `${(newRetention / 100) * 100}%`,
                    backgroundColor: 'var(--success)'
                  }}
                />
              </div>
              <p className="text-center mt-2 font-bold" style={{ color: 'var(--success)' }}>
                +{boost}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-60 mb-1">After</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--success)' }}>{newRetention}%</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h3 className="text-xl font-bold mb-4">Answer Breakdown</h3>
          <div className="space-y-3">
            {quizQuestions.map((q, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === q.correctAnswer;
              const wasSkipped = userAnswer === null;

              return (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    backgroundColor: wasSkipped
                      ? 'var(--background)'
                      : isCorrect
                      ? 'var(--success)' + '20'
                      : 'var(--danger)' + '20'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold opacity-60">Q{index + 1}</span>
                    <p className="text-sm">{q.question}</p>
                  </div>
                  <span className="text-xl">
                    {wasSkipped ? '⊘' : isCorrect ? '✓' : '✗'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/skills/${skillId}`)}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
          >
            Back to Skill
          </button>
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 text-white"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/skills/${skillId}`)}
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 opacity-60" />
            <span className="font-mono font-bold">5:00</span>
          </div>
          <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
            <span className="font-bold">{currentQuestion + 1}</span>
            <span className="opacity-60"> / {quizQuestions.length}</span>
          </div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--card-border)' }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: 'var(--primary)' }}
        />
      </div>

      <div
        className="rounded-2xl p-8 border"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">{skill.icon}</span>
          <h2 className="text-2xl font-bold">{skill.name} Quiz</h2>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{question.question}</h3>

          {question.code && (
            <div
              className="p-4 rounded-lg mb-4 font-mono text-sm"
              style={{ backgroundColor: 'var(--background)' }}
            >
              {question.code}
            </div>
          )}

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = submitted && isCorrect;
              const showIncorrect = submitted && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={submitted}
                  className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                    !submitted ? 'hover:scale-102' : ''
                  } ${showIncorrect ? 'animate-shake' : ''}`}
                  style={{
                    backgroundColor: showCorrect
                      ? 'var(--success)' + '20'
                      : showIncorrect
                      ? 'var(--danger)' + '20'
                      : isSelected
                      ? 'var(--primary)' + '20'
                      : 'var(--background)',
                    borderColor: showCorrect
                      ? 'var(--success)'
                      : showIncorrect
                      ? 'var(--danger)'
                      : isSelected
                      ? 'var(--primary)'
                      : 'transparent'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showCorrect && <span className="text-xl">✓</span>}
                    {showIncorrect && <span className="text-xl">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={submitted}
            className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
          >
            Skip
          </button>
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || submitted}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 text-white"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {submitted ? 'Next...' : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
