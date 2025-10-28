import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { QuizQuestion } from "../services/api";
import { ArrowLeft, Clock, Share2 } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  // For generating quiz without skillId
  const [showInputForm, setShowInputForm] = useState(!skillId);
  const [inputSkillName, setInputSkillName] = useState("");

  useEffect(() => {
    if (skillId) {
      loadSkillAndGenerateQuiz();
    }
  }, [skillId]);

  const loadSkillAndGenerateQuiz = async () => {
    if (!skillId) return;

    try {
      setLoading(true);
      setError(null);

      // Get skill details
      const skillResponse = await api.getSkill(skillId);
      if (skillResponse.success && skillResponse.data) {
        setSkillName(skillResponse.data.name);

        // Generate quiz for this skill
        await generateQuiz(skillResponse.data.name);
      }
    } catch (err) {
      setError("Failed to load skill");
      console.error("Failed to load skill:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async (name: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.generateQuiz(name, 10);

      if (response.success && response.data) {
        setQuestions(response.data);
        setAnswers(new Array(response.data.length).fill(null));
        setShowInputForm(false);
      }
    } catch (err) {
      setError(
        "Failed to generate quiz. AI service might not be configured yet.",
      );
      console.error("Failed to generate quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSkillName.trim()) return;

    setSkillName(inputSkillName);
    await generateQuiz(inputSkillName);
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
    if (questions.length === 0) {
      return { correct: 0, total: 0, percentage: 0 };
    }

    const correct = answers.filter(
      (answer, index) =>
        answer !== null &&
        questions[index] &&
        answer === questions[index].correctAnswer,
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
        proficiency: Math.min(100, 100 + boost), // Boost proficiency
        lastPracticed: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to update skill:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">
          {questions.length === 0
            ? "Generating AI quiz questions..."
            : "Loading..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 rounded-lg"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (showInputForm) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Generate AI Quiz</h1>

        <form
          onSubmit={handleGenerateQuiz}
          className="bg-white rounded-lg shadow p-6"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <label className="block text-lg font-medium mb-2">
            What skill would you like to test?
          </label>
          <input
            type="text"
            value={inputSkillName}
            onChange={(e) => setInputSkillName(e.target.value)}
            placeholder="e.g., React, Python, AWS..."
            className="w-full border rounded px-4 py-2 mb-4"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--card-border)",
              color: "var(--text)",
            }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {loading ? "Generating Quiz..." : "✨ Generate AI Quiz"}
          </button>
        </form>
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
              // Safety check for undefined question
              if (!q) return null;

              const userAnswer = answers[index];
              const isCorrect = userAnswer === q.correctAnswer;
              const wasSkipped = userAnswer === null;

              return (
                <div
                  key={index}
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
                        <p className="opacity-80 mt-1">💡 {q.explanation}</p>
                      )}
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
                navigate("/skills");
              }
            }}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--text)",
            }}
          >
            {skillId ? "Back to Skill" : "View Skills"}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // Safety check - if no questions or current question doesn't exist
  if (questions.length === 0 || !questions[currentQuestion]) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No questions available. Please try generating the quiz again.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 rounded-lg"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{skillName} Quiz</h2>
          <p className="text-sm opacity-60">AI-Generated Questions</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{question.question}</h3>

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
