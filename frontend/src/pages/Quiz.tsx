import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  getQuizForSkill,
  getRandomQuestions,
  getAvailableSkills,
  QuizQuestion,
} from "../data/quizDatabase";
import { mockSkills } from "../data/mockData";
import { ArrowLeft, Share2 } from "lucide-react";

const USER_ID = "mrinali";

const Quiz = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [skillName, setSkillName] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // For quiz selection
  const [showSkillSelect, setShowSkillSelect] = useState(!skillId);
  const availableSkills = getAvailableSkills();

  useEffect(() => {
    if (skillId) {
      loadSkillAndGenerateQuiz();
    }
  }, [skillId]);

  const loadSkillAndGenerateQuiz = async () => {
    if (!skillId) return;

    try {
      setLoading(true);

      // Try to get from API first
      const skillResponse = await api.getSkill(skillId);
      if (skillResponse.success && skillResponse.data) {
        setSkillName(skillResponse.data.name);
        generateLocalQuiz(skillResponse.data.name);
      }
    } catch (err) {
      // Fallback to mock data
      const skill = mockSkills.find((s) => s.id === skillId);
      if (skill) {
        setSkillName(skill.name);
        generateLocalQuiz(skill.name);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateLocalQuiz = (name: string) => {
    const allQuestions = getQuizForSkill(name);
    const selectedQuestions = getRandomQuestions(allQuestions, 10);

    setQuestions(selectedQuestions);
    setAnswers(new Array(selectedQuestions.length).fill(null));
    setShowSkillSelect(false);
  };

  const handleSkillSelect = (name: string) => {
    setSkillName(name);
    generateLocalQuiz(name);
  };

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
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setSubmitted(false);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleSkip = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
    }
  };

  const calculateScore = () => {
    const correct = answers.filter(
      (answer, index) =>
        answer !== null && answer === questions[index].correctAnswer,
    ).length;
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const handleUpdateSkillProficiency = async () => {
    if (!skillId) return;

    try {
      const score = calculateScore();
      const boost = Math.round(score.percentage * 0.15);

      await api.updateSkill(skillId, {
        proficiency: Math.min(100, 50 + boost),
        lastPracticed: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to update skill:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (showSkillSelect) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Select a Skill to Quiz</h1>
        <p className="opacity-60 mb-6">Choose from our available quiz topics</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillSelect(skill)}
              className="p-6 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="text-3xl mb-2">
                {skill === "React"
                  ? "⚛️"
                  : skill === "JavaScript"
                    ? "💛"
                    : skill === "Python"
                      ? "🐍"
                      : skill === "TypeScript"
                        ? "🔷"
                        : skill === "Node.js"
                          ? "🟢"
                          : skill === "Docker"
                            ? "🐳"
                            : skill === "Git"
                              ? "📚"
                              : "💻"}
              </div>
              <h3 className="font-bold">{skill}</h3>
              <p className="text-xs opacity-60 mt-1">10 questions</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();

    // Update skill proficiency if we have skillId
    if (skillId) {
      handleUpdateSkillProficiency();
    }

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
        <div
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{
            background:
              score.percentage >= 80
                ? "linear-gradient(135deg, var(--success) 0%, #059669 100%)"
                : score.percentage >= 60
                  ? "linear-gradient(135deg, var(--warning) 0%, #d97706 100%)"
                  : "linear-gradient(135deg, var(--danger) 0%, #dc2626 100%)",
          }}
        >
          {score.percentage >= 80 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}

          <div className="relative z-10">
            <span className="text-6xl mb-4 block">
              {score.percentage >= 80
                ? "🎉"
                : score.percentage >= 60
                  ? "👍"
                  : "💪"}
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">
              {score.percentage >= 80
                ? "Excellent Work!"
                : score.percentage >= 60
                  ? "Good Job!"
                  : "Keep Practicing!"}
            </h2>
            <p className="text-white/80 mb-6">
              You scored {score.correct} out of {score.total} questions
            </p>

            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-7xl font-bold text-white">
                {score.percentage}%
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <h3 className="text-xl font-bold mb-4">Answer Breakdown</h3>
          <div className="space-y-3">
            {questions.map((q, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === q.correctAnswer;
              const wasSkipped = userAnswer === null;

              return (
                <div
                  key={q.id}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: wasSkipped
                      ? "var(--background)"
                      : isCorrect
                        ? "var(--success)" + "20"
                        : "var(--danger)" + "20",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <span className="font-bold opacity-60 mr-2">
                        Q{index + 1}
                      </span>
                      <span className="text-sm">{q.question}</span>
                    </div>
                    <span className="text-xl ml-2">
                      {wasSkipped ? "⊘" : isCorrect ? "✓" : "✗"}
                    </span>
                  </div>

                  {!isCorrect && !wasSkipped && (
                    <div className="text-sm mt-2 pl-8">
                      <p className="opacity-60">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                      {q.explanation && (
                        <p className="opacity-80 mt-1 text-green-600">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {isCorrect && q.explanation && (
                    <div className="text-sm mt-2 pl-8 opacity-80">
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              if (skillId) {
                navigate(`/skills/${skillId}`);
              } else {
                setShowSkillSelect(true);
                setQuestions([]);
                setAnswers([]);
                setCurrentQuestion(0);
                setShowResults(false);
              }
            }}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--text)",
            }}
          >
            {skillId ? "Back to Skill" : "Take Another Quiz"}
          </button>
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--text)",
            }}
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button
            onClick={() => {
              setShowSkillSelect(true);
              setQuestions([]);
              setAnswers([]);
              setCurrentQuestion(0);
              setShowResults(false);
            }}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Choose Another Skill
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  // ADD THIS CHECK:
  if (!questions || questions.length === 0 || !questions[currentQuestion]) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading questions...</div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (skillId) {
              navigate(`/skills/${skillId}`);
            } else {
              setShowSkillSelect(true);
              setQuestions([]);
            }
          }}
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <div
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <span className="font-bold">{currentQuestion + 1}</span>
            <span className="opacity-60"> / {questions.length}</span>
          </div>
        </div>
      </div>

      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--card-border)" }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: "var(--primary)" }}
        />
      </div>

      <div
        className="rounded-2xl p-8 border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">
            {skillName === "React"
              ? "⚛️"
              : skillName === "JavaScript"
                ? "💛"
                : skillName === "Python"
                  ? "🐍"
                  : skillName === "TypeScript"
                    ? "🔷"
                    : skillName === "Node.js"
                      ? "🟢"
                      : skillName === "Docker"
                        ? "🐳"
                        : skillName === "Git"
                          ? "📚"
                          : "💻"}
          </span>
          <h2 className="text-2xl font-bold">{skillName} Quiz</h2>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{question.question}</h3>

          {question.code && (
            <div
              className="p-4 rounded-lg mb-4 font-mono text-sm"
              style={{ backgroundColor: "var(--background)" }}
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
                    !submitted ? "hover:scale-102" : ""
                  } ${showIncorrect ? "animate-shake" : ""}`}
                  style={{
                    backgroundColor: showCorrect
                      ? "var(--success)" + "20"
                      : showIncorrect
                        ? "var(--danger)" + "20"
                        : isSelected
                          ? "var(--primary)" + "20"
                          : "var(--background)",
                    borderColor: showCorrect
                      ? "var(--success)"
                      : showIncorrect
                        ? "var(--danger)"
                        : isSelected
                          ? "var(--primary)"
                          : "transparent",
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

          {submitted && question.explanation && (
            <div
              className="mt-4 p-4 rounded-lg"
              style={{ backgroundColor: "var(--background)" }}
            >
              <p className="text-sm">
                <span className="font-bold">💡 Explanation: </span>
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            disabled={submitted}
            className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--text)",
            }}
          >
            Skip
          </button>
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || submitted}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {submitted ? "Next..." : "Submit Answer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
