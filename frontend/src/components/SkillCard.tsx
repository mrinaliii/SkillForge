import { Skill } from '../data/mockData';
import RetentionGauge from './RetentionGauge';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
  variant?: 'compact' | 'detailed' | 'mini';
  onClick?: () => void;
}

const SkillCard = ({ skill, variant = 'compact', onClick }: SkillCardProps) => {
  const getTrendIcon = () => {
    if (skill.retention >= 80) return <TrendingUp className="w-4 h-4 text-[var(--success)]" />;
    if (skill.retention >= 50) return <Minus className="w-4 h-4 text-[var(--warning)]" />;
    return <TrendingDown className="w-4 h-4 text-[var(--danger)]" />;
  };

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

  if (variant === 'mini') {
    return (
      <div
        onClick={onClick}
        className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{skill.icon}</span>
            <div>
              <h4 className="font-semibold text-sm">{skill.name}</h4>
              <p className="text-xs opacity-60">{skill.daysUnused} days ago</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <RetentionGauge percentage={skill.retention} size="sm" showLabel={false} />
          <div className="text-right">
            <p className="text-2xl font-bold" style={{
              color: skill.retention >= 80 ? 'var(--success)' :
                     skill.retention >= 50 ? 'var(--warning)' : 'var(--danger)'
            }}>
              {skill.retention}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        onClick={onClick}
        className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{skill.icon}</span>
            <div>
              <h3 className="font-bold text-xl">{skill.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: getCategoryColor(skill.category) + '20', color: getCategoryColor(skill.category) }}
                >
                  {skill.category}
                </span>
                <span className="text-xs opacity-60">Level {skill.proficiency}/10</span>
              </div>
            </div>
          </div>
          {getTrendIcon()}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <RetentionGauge percentage={skill.retention} size="md" />
          </div>
          <div className="text-right">
            <p className="text-sm opacity-60 mb-1">Last used</p>
            <p className="font-semibold">{skill.daysUnused} days ago</p>
            <p className="text-xs opacity-40 mt-1">{skill.lastUsed}</p>
          </div>
        </div>

        <button className="w-full mt-4 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--primary)', color: 'white' }}
        >
          Practice Now
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{skill.icon}</span>
          <div>
            <h3 className="font-bold text-lg">{skill.name}</h3>
            <span
              className="text-xs px-2 py-1 rounded-full inline-block mt-1"
              style={{ backgroundColor: getCategoryColor(skill.category) + '20', color: getCategoryColor(skill.category) }}
            >
              {skill.category}
            </span>
          </div>
        </div>
        {getTrendIcon()}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <RetentionGauge percentage={skill.retention} size="sm" showLabel={false} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs opacity-60">Retention</span>
            <span className="text-lg font-bold" style={{
              color: skill.retention >= 80 ? 'var(--success)' :
                     skill.retention >= 50 ? 'var(--warning)' : 'var(--danger)'
            }}>
              {skill.retention}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${skill.retention}%`,
                backgroundColor: skill.retention >= 80 ? 'var(--success)' :
                                skill.retention >= 50 ? 'var(--warning)' : 'var(--danger)'
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="opacity-60">Last used</span>
        <span className="font-medium">{skill.daysUnused} days ago</span>
      </div>
    </div>
  );
};

export default SkillCard;
