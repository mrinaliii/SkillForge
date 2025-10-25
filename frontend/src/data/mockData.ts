export interface Skill {
  id: string;
  name: string;
  retention: number;
  lastUsed: string;
  daysUnused: number;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Mobile' | 'Data Science';
  proficiency: number;
  icon: string;
}

export interface HistoricalData {
  date: string;
  retention: number;
}

export interface QuizResult {
  id: string;
  skillId: string;
  skillName: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface ActivityDay {
  date: string;
  count: number;
}

export const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'React',
    retention: 87,
    lastUsed: '2025-10-12',
    daysUnused: 5,
    category: 'Frontend',
    proficiency: 9,
    icon: '⚛️'
  },
  {
    id: '2',
    name: 'Python',
    retention: 72,
    lastUsed: '2025-09-29',
    daysUnused: 18,
    category: 'Backend',
    proficiency: 8,
    icon: '🐍'
  },
  {
    id: '3',
    name: 'Docker',
    retention: 45,
    lastUsed: '2025-09-05',
    daysUnused: 42,
    category: 'DevOps',
    proficiency: 6,
    icon: '🐳'
  },
  {
    id: '4',
    name: 'TypeScript',
    retention: 91,
    lastUsed: '2025-10-15',
    daysUnused: 2,
    category: 'Frontend',
    proficiency: 9,
    icon: '📘'
  },
  {
    id: '5',
    name: 'PostgreSQL',
    retention: 63,
    lastUsed: '2025-09-22',
    daysUnused: 25,
    category: 'Backend',
    proficiency: 7,
    icon: '🐘'
  },
  {
    id: '6',
    name: 'Git',
    retention: 95,
    lastUsed: '2025-10-16',
    daysUnused: 1,
    category: 'DevOps',
    proficiency: 10,
    icon: '🔀'
  },
  {
    id: '7',
    name: 'Next.js',
    retention: 78,
    lastUsed: '2025-10-05',
    daysUnused: 12,
    category: 'Frontend',
    proficiency: 8,
    icon: '▲'
  },
  {
    id: '8',
    name: 'TensorFlow',
    retention: 34,
    lastUsed: '2025-08-11',
    daysUnused: 67,
    category: 'Data Science',
    proficiency: 5,
    icon: '🧠'
  }
];

export const generateHistoricalData = (skillId: string, currentRetention: number): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const today = new Date('2025-10-17');
  const daysAgo = 90;

  for (let i = daysAgo; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const progress = (daysAgo - i) / daysAgo;
    const retention = Math.max(currentRetention, 100 - (progress * (100 - currentRetention)));

    data.push({
      date: date.toISOString().split('T')[0],
      retention: Math.round(retention)
    });
  }

  return data;
};

export const generatePredictedData = (currentRetention: number): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const today = new Date('2025-10-17');
  const daysAhead = 90;

  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const decayRate = 0.5;
    const retention = Math.max(0, currentRetention - (i * decayRate));

    data.push({
      date: date.toISOString().split('T')[0],
      retention: Math.round(retention)
    });
  }

  return data;
};

export const mockQuizResults: QuizResult[] = [
  {
    id: '1',
    skillId: '1',
    skillName: 'React',
    score: 7,
    totalQuestions: 10,
    date: '2025-10-10'
  },
  {
    id: '2',
    skillId: '4',
    skillName: 'TypeScript',
    score: 9,
    totalQuestions: 10,
    date: '2025-10-12'
  },
  {
    id: '3',
    skillId: '2',
    skillName: 'Python',
    score: 6,
    totalQuestions: 10,
    date: '2025-10-08'
  },
  {
    id: '4',
    skillId: '7',
    skillName: 'Next.js',
    score: 8,
    totalQuestions: 10,
    date: '2025-10-05'
  }
];

export const generateActivityHeatmap = (): ActivityDay[] => {
  const data: ActivityDay[] = [];
  const today = new Date('2025-10-17');
  const daysBack = 365;

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const baseActivity = isWeekend ? 3 : 1;
    const randomFactor = Math.random() > 0.3 ? Math.floor(Math.random() * 3) : 0;

    data.push({
      date: date.toISOString().split('T')[0],
      count: baseActivity + randomFactor
    });
  }

  return data;
};

export const calculateSkillHealthScore = (skills: Skill[]): number => {
  if (skills.length === 0) return 0;

  const totalRetention = skills.reduce((sum, skill) => sum + skill.retention, 0);
  return Math.round(totalRetention / skills.length);
};

export const getSkillsAtRisk = (skills: Skill[]): Skill[] => {
  return skills
    .filter(skill => skill.retention < 70)
    .sort((a, b) => a.retention - b.retention)
    .slice(0, 3);
};

export const getCurrentStreak = (): number => {
  return 7;
};

export const getBestStreak = (): number => {
  return 14;
};
