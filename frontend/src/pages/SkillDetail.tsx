import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import RetentionGauge from '../components/RetentionGauge';
import { mockSkills, generateHistoricalData, generatePredictedData } from '../data/mockData';
import { ArrowLeft, Calendar, TrendingDown, Edit, CheckCircle } from 'lucide-react';

const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const skill = mockSkills.find(s => s.id === id);

  if (!skill) {
    return (
      <div className="text-center py-12">
        <p className="text-xl opacity-60">Skill not found</p>
        <button
          onClick={() => navigate('/skills')}
          className="mt-4 px-6 py-2 rounded-lg"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          Back to Skills
        </button>
      </div>
    );
  }

  const historicalData = generateHistoricalData(skill.id, skill.retention);
  const predictedData = generatePredictedData(skill.retention);
  const combinedData = [...historicalData, ...predictedData];

  const today = new Date('2025-10-17').toISOString().split('T')[0];

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Frontend: '#3b82f6',
      Backend: '#10b981',
      DevOps: '#f59e0b',
      Mobile: '#ec4899',
      'Data Science': '#8b5cf6'
    };
    return colors[category] || '#6b7280';
  };

  const milestones = [
    { date: '2025-11-20', label: 'Drops below 70%', value: 70 },
    { date: '2025-12-15', label: 'Drops below 50%', value: 50 }
  ].filter(m => {
    const milestone = predictedData.find(d => d.date === m.date);
    return milestone && milestone.retention >= m.value - 5;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/skills')}
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ backgroundColor: 'var(--card-bg)' }}
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
                    backgroundColor: getCategoryColor(skill.category) + '20',
                    color: getCategoryColor(skill.category)
                  }}
                >
                  {skill.category}
                </span>
                <span className="text-sm opacity-60">Level {skill.proficiency}/10</span>
              </div>
            </div>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--background)' }}
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="rounded-xl p-6 border text-center"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <p className="text-sm opacity-60 mb-4">Current Retention</p>
          <RetentionGauge percentage={skill.retention} size="lg" showLabel={true} />
          <p className="mt-4 text-sm opacity-60">
            {skill.retention >= 80 ? 'Strong retention!' :
             skill.retention >= 50 ? 'Practice soon' :
             'Needs attention'}
          </p>
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--primary)' + '20' }}>
              <Calendar className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <p className="text-sm opacity-60">Last Used</p>
              <h3 className="text-xl font-bold">{skill.daysUnused} days ago</h3>
            </div>
          </div>
          <p className="text-sm opacity-60 mb-2">Date: {skill.lastUsed}</p>
          <button
            className="w-full mt-4 px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            <CheckCircle className="w-5 h-5" />
            Mark as Used Today
          </button>
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--danger)' + '20' }}>
              <TrendingDown className="w-6 h-6" style={{ color: 'var(--danger)' }} />
            </div>
            <div>
              <p className="text-sm opacity-60">Decay Rate</p>
              <h3 className="text-xl font-bold">0.5% per day</h3>
            </div>
          </div>
          <p className="text-sm opacity-60 mb-2">
            Without practice, retention drops by approximately 0.5% each day
          </p>
        </div>
      </div>

      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <h2 className="text-2xl font-bold mb-6">Retention Forecast</h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis
                dataKey="date"
                stroke="var(--text)"
                tick={{ fill: 'var(--text)', opacity: 0.6 }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                interval={30}
              />
              <YAxis
                stroke="var(--text)"
                tick={{ fill: 'var(--text)', opacity: 0.6 }}
                domain={[0, 100]}
                label={{ value: 'Retention %', angle: -90, position: 'insideLeft', fill: 'var(--text)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  color: 'var(--text)'
                }}
                formatter={(value: number) => [`${value}%`, 'Retention']}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <ReferenceLine y={50} stroke="var(--danger)" strokeDasharray="5 5" />
              <ReferenceLine x={today} stroke="var(--primary)" strokeDasharray="5 5" label="Today" />

              <Line
                type="monotone"
                dataKey="retention"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={false}
                strokeDasharray={(point: any) => {
                  return point.date > today ? '5 5' : '0';
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5" style={{ backgroundColor: 'var(--primary)' }} />
            <span className="text-sm opacity-60">Historical data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: 'var(--primary)' }} />
            <span className="text-sm opacity-60">Predicted decay</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: 'var(--danger)' }} />
            <span className="text-sm opacity-60">Danger zone (below 50%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h3 className="text-xl font-bold mb-4">Activity Timeline</h3>
          <div className="space-y-4">
            {[
              { date: '2025-10-10', event: 'Quiz taken', score: '85%', icon: '📝' },
              { date: '2025-10-05', event: 'Marked as used', icon: '✓' },
              { date: '2025-10-01', event: 'Skill added', icon: '➕' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary)' + '20' }}
                >
                  <span>{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.event}</p>
                  <p className="text-sm opacity-60">{activity.date}</p>
                </div>
                {activity.score && (
                  <span className="font-bold" style={{ color: 'var(--success)' }}>
                    {activity.score}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/quiz/${skill.id}`)}
              className="w-full px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 text-left flex items-center justify-between"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              <span>Take Quiz</span>
              <span>→</span>
            </button>
            <button
              className="w-full px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 text-left flex items-center justify-between"
              style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
            >
              <span>Practice Resources</span>
              <span>→</span>
            </button>
            <button
              className="w-full px-4 py-3 rounded-lg font-medium transition-all hover:scale-105 text-left flex items-center justify-between"
              style={{ backgroundColor: 'var(--background)', color: 'var(--text)' }}
            >
              <span>View Related Skills</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
