import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import RetentionGauge from "../components/RetentionGauge";
import api, { Skill, SkillHealth } from "../services/api";
import {
  generateHistoricalData,
  generatePredictedData,
} from "../data/mockData";
import {
  ArrowLeft,
  Calendar,
  TrendingDown,
  Edit,
  CheckCircle,
} from "lucide-react";

const USER_ID = "mrinali";

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [skill, setSkill] = useState<Skill | null>(null);
  const [healthScore, setHealthScore] = useState<SkillHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSkillData();
    }
  }, [id]);

  const loadSkillData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Load skill details
      const skillResponse = await api.getSkill(id);
      if (skillResponse.success && skillResponse.data) {
        const mappedSkill = {
          ...skillResponse.data,
          id: skillResponse.data.skillId,
          icon: getIconForCategory(skillResponse.data.category),
          retention:
            skillResponse.data.currentProficiency ||
            skillResponse.data.proficiency,
          daysUnused: Math.floor(
            (Date.now() -
              new Date(skillResponse.data.lastPracticed).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
          lastUsed: new Date(
            skillResponse.data.lastPracticed,
          ).toLocaleDateString(),
        };
        setSkill(mappedSkill);

        // Load health score
        const healthResponse = await api.getSkillHealth(id);
        if (healthResponse.success && healthResponse.data) {
          setHealthScore(healthResponse.data);
        }
      }
    } catch (error) {
      console.error("Failed to load skill data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (category: string): string => {
    const icons: Record<string, string> = {
      Frontend: "⚛️",
      Backend: "🔧",
      DevOps: "🐳",
      Mobile: "📱",
      "Data Science": "📊",
      "Programming Language": "🐍",
      Database: "🗄️",
    };
    return icons[category] || "📚";
  };

  const handleMarkAsUsed = async () => {
    if (!skill) return;

    try {
      await api.updateSkill(skill.skillId, {
        lastPracticed: new Date().toISOString(),
        proficiency: Math.min(100, skill.proficiency + 5),
      });

      alert("✅ Marked as used today!");
      loadSkillData();
    } catch (error) {
      alert("Failed to update skill");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading skill details...</div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="text-center py-12">
        <p className="text-xl opacity-60">Skill not found</p>
        <button
          onClick={() => navigate("/skills")}
          className="mt-4 px-6 py-2 rounded-lg"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          Back to Skills
        </button>
      </div>
    );
  }

  const historicalData = generateHistoricalData(
    skill.id,
    skill.retention || 50,
  );
  const predictedData = generatePredictedData(skill.retention || 50);
  const combinedData = [...historicalData, ...predictedData];
  const today = new Date().toISOString().split("T")[0];

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Frontend: "#3b82f6",
      Backend: "#10b981",
      DevOps: "#f59e0b",
      Mobile: "#ec4899",
      "Data Science": "#8b5cf6",
    };
    return colors[category] || "#6b7280";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/skills")}
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{skill.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{skill.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: getCategoryColor(skill.category) + "20",
                    color: getCategoryColor(skill.category),
                  }}
                >
                  {skill.category}
                </span>
                <span className="text-sm opacity-60">
                  Proficiency: {skill.proficiency}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="rounded-xl p-6 border text-center"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <p className="text-sm opacity-60 mb-4">Current Health</p>
          <RetentionGauge
            percentage={healthScore?.currentHealthScore || skill.retention || 0}
            size="lg"
            showLabel={true}
          />
          {healthScore && (
            <div className="mt-4">
              <p
                className="text-sm font-bold"
                style={{
                  color:
                    healthScore.status === "healthy"
                      ? "var(--success)"
                      : healthScore.status === "warning"
                        ? "var(--warning)"
                        : "var(--danger)",
                }}
              >
                {healthScore.status.toUpperCase()}
              </p>
            </div>
          )}
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "var(--primary)" + "20" }}
            >
              <Calendar
                className="w-6 h-6"
                style={{ color: "var(--primary)" }}
              />
            </div>
            <div>
              <p className="text-sm opacity-60">Last Used</p>
              <h3 className="text-xl font-bold">
                {skill.daysUnused || 0} days ago
              </h3>
            </div>
          </div>
          <p className="text-sm opacity-60 mb-2">Date: {skill.lastUsed}</p>
          <button
            onClick={handleMarkAsUsed}
            className="w-full mt-4 px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--primary)", color: "white" }}
          >
            <CheckCircle className="w-5 h-5" />
            Mark as Used Today
          </button>
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "var(--danger)" + "20" }}
            >
              <TrendingDown
                className="w-6 h-6"
                style={{ color: "var(--danger)" }}
              />
            </div>
            <div>
              <p className="text-sm opacity-60">Decay Rate</p>
              <h3 className="text-xl font-bold">
                {(skill.decayRate || 0.1) * 100}% per day
              </h3>
            </div>
          </div>
          <p className="text-sm opacity-60 mb-2">
            Without practice, retention drops daily
          </p>
        </div>
      </div>

      {/* Retention Forecast Chart */}
      <div
        className="rounded-xl p-6 border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6">Retention Forecast</h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--card-border)"
              />
              <XAxis
                dataKey="date"
                stroke="var(--text)"
                tick={{ fill: "var(--text)", opacity: 0.6 }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                interval={30}
              />
              <YAxis
                stroke="var(--text)"
                tick={{ fill: "var(--text)", opacity: 0.6 }}
                domain={[0, 100]}
                label={{
                  value: "Health %",
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--text)",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "8px",
                  color: "var(--text)",
                }}
                formatter={(value: number) => [`${value}%`, "Health"]}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <ReferenceLine
                y={50}
                stroke="var(--danger)"
                strokeDasharray="5 5"
              />
              <ReferenceLine
                x={today}
                stroke="var(--primary)"
                strokeDasharray="5 5"
                label="Today"
              />

              <Line
                type="monotone"
                dataKey="retention"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={false}
                strokeDasharray={(point: any) => {
                  return point.date > today ? "5 5" : "0";
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <h3 className="text-xl font-bold mb-4">Activity Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--primary)" + "20" }}
              >
                <span>✓</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Last practiced</p>
                <p className="text-sm opacity-60">{skill.lastUsed}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--success)" + "20" }}
              >
                <span>+</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Skill added</p>
                <p className="text-sm opacity-60">
                  {new Date(skill.createdAt).toLocaleDateString()}
                </p>
              </div>
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
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/quiz/${skill.skillId}`)}
              className="w-full px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 text-left flex items-center justify-between"
              style={{ backgroundColor: "var(--primary)", color: "white" }}
            >
              <span>📝 Take Quiz</span>
              <span>→</span>
            </button>
            <button
              onClick={handleMarkAsUsed}
              className="w-full px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 text-left flex items-center justify-between"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--text)",
              }}
            >
              <span>✓ Mark as Practiced</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
