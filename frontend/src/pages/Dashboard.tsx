import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RetentionGauge from "../components/RetentionGauge";
import SkillCard from "../components/SkillCard";
import api, { Skill, SkillHealth } from "../services/api";
import { Plus, Zap, Flame } from "lucide-react";

const USER_ID = "mrinali"; // TODO: Replace with actual auth

const Dashboard = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [healthScores, setHealthScores] = useState<Record<string, SkillHealth>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(75);
  const [currentStreak] = useState(5);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await api.getSkills(USER_ID);

      if (response.success && response.data) {
        // Map backend data to frontend format
        const mappedSkills = response.data.map((skill) => ({
          ...skill,
          id: skill.skillId,
          icon: getIconForCategory(skill.category),
          retention: skill.currentProficiency || skill.proficiency,
          daysUnused: Math.floor(
            (Date.now() - new Date(skill.lastPracticed).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
          lastUsed: new Date(skill.lastPracticed).toLocaleDateString(),
        }));

        setSkills(mappedSkills);

        // Calculate overall health score
        if (mappedSkills.length > 0) {
          const avgHealth =
            mappedSkills.reduce((sum, s) => sum + (s.retention || 0), 0) /
            mappedSkills.length;
          setHealthScore(Math.round(avgHealth));
        }

        // Load health scores for each skill
        loadHealthScores(mappedSkills);
      }
    } catch (error) {
      console.error("Failed to load skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadHealthScores = async (skillList: Skill[]) => {
    const scores: Record<string, SkillHealth> = {};

    for (const skill of skillList) {
      try {
        const response = await api.getSkillHealth(skill.skillId);
        if (response.success && response.data) {
          scores[skill.skillId] = response.data;
        }
      } catch (error) {
        console.error(`Failed to load health for ${skill.name}:`, error);
      }
    }

    setHealthScores(scores);
  };

  const getIconForCategory = (category: string): string => {
    const icons: Record<string, string> = {
      Frontend: "⚛️",
      "Frontend Framework": "⚛️",
      Backend: "🔧",
      DevOps: "🐳",
      Mobile: "📱",
      "Data Science": "📊",
      "Programming Language": "💻",
      Database: "🗄️",
    };
    return icons[category] || "📚";
  };

  const handleSyncGitHub = async () => {
    const username = prompt("Enter your GitHub username:");
    if (!username) return;

    try {
      setLoading(true);
      const response = await api.syncGitHub(USER_ID, username);

      if (response.success && response.data) {
        alert(
          `✅ Detected ${response.data.skillsDetected} skills from GitHub!`,
        );
        loadSkills();
      }
    } catch (error) {
      console.error("GitHub sync failed:", error);
      alert("❌ Failed to sync GitHub");
    } finally {
      setLoading(false);
    }
  };

  const skillsAtRisk = skills
    .filter((skill) => {
      const health = healthScores[skill.skillId];
      return (
        (health && health.status === "warning") || health?.status === "critical"
      );
    })
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading your skills...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="opacity-60">
            Track your technical skills and stay sharp
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSyncGitHub}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--background)",
              color: "var(--text)",
            }}
          >
            🔗 Sync GitHub
          </button>
          <button
            onClick={() => navigate("/skills")}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <Plus className="w-5 h-5" />
            Add Skill
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl p-8 relative overflow-hidden animate-scale-in"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
        }}
      >
        <div className="relative z-10">
          <p className="text-white/80 text-sm mb-2">Overall Performance</p>
          <h2 className="text-white text-2xl font-bold mb-6">
            Skill Health Score
          </h2>

          <div className="flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <RetentionGauge
                percentage={healthScore}
                size="lg"
                showLabel={false}
              />
              <p className="text-white text-center mt-4 text-sm">
                {skills.length === 0
                  ? "Add skills to get started!"
                  : healthScore >= 80
                    ? "Excellent! Keep it up!"
                    : healthScore >= 60
                      ? "Good progress!"
                      : "Time to practice!"}
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: "white" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            className="rounded-xl p-6 border animate-slide-in"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Skills at Risk</h3>
              <Zap className="w-5 h-5" style={{ color: "var(--warning)" }} />
            </div>

            {skillsAtRisk.length === 0 ? (
              <div className="text-center py-8">
                <p className="opacity-60">
                  {skills.length === 0
                    ? "No skills tracked yet. Add your first skill!"
                    : "No skills at risk! Great job!"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {skillsAtRisk.map((skill, index) => (
                  <div
                    key={skill.skillId}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <SkillCard
                      skill={skill}
                      variant="mini"
                      onClick={() => navigate(`/skills/${skill.skillId}`)}
                    />
                  </div>
                ))}
              </div>
            )}

            {skills.length > 0 && (
              <button
                onClick={() => navigate("/skills")}
                className="w-full mt-4 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--text)",
                }}
              >
                View All Skills
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="rounded-xl p-6 border animate-slide-in"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)",
              animationDelay: "100ms",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "var(--warning)" + "20" }}
              >
                <Flame
                  className="w-6 h-6"
                  style={{ color: "var(--warning)" }}
                />
              </div>
              <div>
                <p className="text-sm opacity-60">Current Streak</p>
                <h3 className="text-2xl font-bold">{currentStreak} Days</h3>
              </div>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--background)" }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${(currentStreak / 14) * 100}%`,
                  backgroundColor: "var(--warning)",
                }}
              />
            </div>
            <p className="text-xs opacity-60 mt-2">Best: 14 days</p>
          </div>

          <div
            className="rounded-xl p-6 border animate-slide-in"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)",
              animationDelay: "200ms",
            }}
          >
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/quiz/generate")}
                className="w-full px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 text-left"
                style={{ backgroundColor: "var(--primary)", color: "white" }}
              >
                <span className="text-lg mr-2">📝</span>
                Take a Quiz
              </button>
              <button
                onClick={() => navigate("/skills")}
                className="w-full px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 text-left"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--text)",
                }}
              >
                <span className="text-lg mr-2">➕</span>
                Add New Skill
              </button>
            </div>
          </div>
        </div>
      </div>

      {skills.length > 0 && (
        <div
          className="rounded-xl p-6 border animate-slide-in"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
            animationDelay: "300ms",
          }}
        >
          <h3 className="text-xl font-bold mb-4">Skills Timeline</h3>
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {skills
              .sort((a, b) => (b.retention || 0) - (a.retention || 0))
              .map((skill) => {
                const health = healthScores[skill.skillId];
                const retention =
                  health?.currentHealthScore || skill.retention || 50;

                return (
                  <div
                    key={skill.skillId}
                    onClick={() => navigate(`/skills/${skill.skillId}`)}
                    className="flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-110 flex-shrink-0"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-4"
                      style={{
                        backgroundColor: "var(--card-bg)",
                        borderColor:
                          retention >= 80
                            ? "var(--success)"
                            : retention >= 50
                              ? "var(--warning)"
                              : "var(--danger)",
                      }}
                    >
                      {skill.icon}
                    </div>
                    <span className="text-xs font-medium max-w-[60px] text-center truncate">
                      {skill.name}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{
                        color:
                          retention >= 80
                            ? "var(--success)"
                            : retention >= 50
                              ? "var(--warning)"
                              : "var(--danger)",
                      }}
                    >
                      {Math.round(retention)}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
