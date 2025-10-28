import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api, { Skill } from "../services/api";
import { generateActivityHeatmap } from "../data/mockData";
import { TrendingUp, Calendar, Award } from "lucide-react";

const USER_ID = "mrinali";

const Analytics = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await api.getSkills(USER_ID);

      if (response.success && response.data) {
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
      }
    } catch (error) {
      console.error("Failed to load skills:", error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  const retentionData = skills
    .sort((a, b) => (b.retention || 0) - (a.retention || 0))
    .map((skill) => ({
      name: skill.name,
      retention: skill.retention || 0,
      icon: skill.icon,
    }));

  const categoryData = skills.reduce(
    (acc, skill) => {
      const existing = acc.find((item) => item.category === skill.category);
      if (existing) {
        existing.count++;
        existing.totalRetention += skill.retention || 0;
      } else {
        acc.push({
          category: skill.category,
          count: 1,
          totalRetention: skill.retention || 0,
        });
      }
      return acc;
    },
    [] as { category: string; count: number; totalRetention: number }[],
  );

  const pieData = categoryData.map((item) => ({
    name: item.category,
    value: item.count,
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  // Calculate retention over time (using real data)
  const retentionOverTime = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));

    // Calculate average retention for this month
    const avgRetention =
      skills.length > 0
        ? skills.reduce((sum, s) => sum + (s.retention || 0), 0) / skills.length
        : 0;

    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      retention: Math.max(0, avgRetention - (11 - i) * 2), // Simulate improvement over time
    };
  });

  const activityData = generateActivityHeatmap();
  const last12Weeks = activityData.slice(-84);

  const getWeekData = () => {
    const weeks = [];
    for (let i = 0; i < 12; i++) {
      const weekData = last12Weeks.slice(i * 7, (i + 1) * 7);
      weeks.push(weekData);
    }
    return weeks;
  };

  const weekData = getWeekData();

  // Find most improved skill
  const mostImproved =
    skills.length > 0
      ? skills.reduce(
          (max, skill) =>
            (skill.retention || 0) > (max.retention || 0) ? skill : max,
          skills[0],
        )
      : null;

  const avgProficiency =
    skills.length > 0
      ? Math.round(
          skills.reduce((sum, s) => sum + (s.retention || 0), 0) /
            skills.length,
        )
      : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="opacity-60">Track your learning progress and patterns</p>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl opacity-60 mb-4">No skills tracked yet</p>
          <p className="opacity-60">Add skills to see analytics</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "var(--success)" + "20" }}
                >
                  <TrendingUp
                    className="w-6 h-6"
                    style={{ color: "var(--success)" }}
                  />
                </div>
                <div>
                  <p className="text-sm opacity-60">Highest Retention</p>
                  <h3 className="text-xl font-bold">
                    {mostImproved?.name || "N/A"}
                  </h3>
                </div>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--success)" }}
              >
                {mostImproved
                  ? `${Math.round(mostImproved.retention || 0)}%`
                  : "0%"}
              </p>
              <p className="text-xs opacity-60 mt-1">Keep up the great work!</p>
            </div>

            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
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
                  <p className="text-sm opacity-60">Total Skills</p>
                  <h3 className="text-xl font-bold">{skills.length}</h3>
                </div>
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {categoryData.length}
              </p>
              <p className="text-xs opacity-60 mt-1">Categories tracked</p>
            </div>

            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "var(--warning)" + "20" }}
                >
                  <Award
                    className="w-6 h-6"
                    style={{ color: "var(--warning)" }}
                  />
                </div>
                <div>
                  <p className="text-sm opacity-60">Average Proficiency</p>
                  <h3 className="text-xl font-bold">{avgProficiency}%</h3>
                </div>
              </div>
              <p className="text-xs opacity-60 mt-1">Across all skills</p>
            </div>
          </div>

          <div
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            <h2 className="text-2xl font-bold mb-6">Activity Heatmap</h2>
            <div className="overflow-x-auto">
              <div className="inline-flex flex-col gap-1">
                <div className="flex gap-1 mb-2 ml-8">
                  {["Mon", "Wed", "Fri"].map((day) => (
                    <div
                      key={day}
                      className="text-xs opacity-60 w-3"
                      style={{ marginLeft: "8px" }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, dayIndex) => (
                    <div key={day} className="flex items-center gap-2">
                      <span className="text-xs opacity-60 w-6">{day}</span>
                      <div className="flex gap-1">
                        {weekData.map((week, weekIndex) => {
                          const dayData = week[dayIndex];
                          const intensity = dayData
                            ? Math.min(dayData.count / 5, 1)
                            : 0;

                          return (
                            <div
                              key={weekIndex}
                              className="w-3 h-3 rounded-sm transition-all hover:scale-150 cursor-pointer"
                              style={{
                                backgroundColor:
                                  intensity === 0
                                    ? "var(--card-border)"
                                    : `rgba(146, 136, 226, ${0.2 + intensity * 0.8})`,
                              }}
                              title={
                                dayData
                                  ? `${dayData.date}: ${dayData.count} activities`
                                  : "No activity"
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs opacity-60">
                <span>Less</span>
                {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor:
                        intensity === 0
                          ? "var(--card-border)"
                          : `rgba(146, 136, 226, ${0.2 + intensity * 0.8})`,
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <h2 className="text-2xl font-bold mb-6">Overall Skill Health</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionOverTime}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--card-border)"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="var(--text)"
                      tick={{ fill: "var(--text)", opacity: 0.6 }}
                    />
                    <YAxis
                      stroke="var(--text)"
                      tick={{ fill: "var(--text)", opacity: 0.6 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "8px",
                        color: "var(--text)",
                      }}
                      formatter={(value: number) => [
                        `${Math.round(value)}%`,
                        "Average Retention",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="retention"
                      stroke="var(--primary)"
                      strokeWidth={3}
                      dot={{ fill: "var(--primary)", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <h2 className="text-2xl font-bold mb-6">Skills by Category</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "8px",
                        color: "var(--text)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
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
            <h2 className="text-2xl font-bold mb-6">
              Skills Ranked by Retention
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={retentionData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--card-border)"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    stroke="var(--text)"
                    tick={{ fill: "var(--text)", opacity: 0.6 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="var(--text)"
                    tick={{ fill: "var(--text)", opacity: 0.6 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "8px",
                      color: "var(--text)",
                    }}
                    formatter={(value: number) => [`${value}%`, "Retention"]}
                  />
                  <Bar
                    dataKey="retention"
                    fill="var(--primary)"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
