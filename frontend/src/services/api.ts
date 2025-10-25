const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface Skill {
  skillId: string;
  userId: string;
  name: string;
  category: string;
  proficiency: number;
  lastPracticed: string;
  createdAt: string;
  updatedAt: string;
  decayRate: number;
  currentProficiency?: number;
}

interface SkillHealth {
  skillId: string;
  name: string;
  originalProficiency: number;
  currentHealthScore: number;
  daysSinceLastPractice: number;
  status: "healthy" | "warning" | "critical";
}

interface Challenge {
  challengeId: string;
  skillId: string;
  title: string;
  description: string;
  requirements: string[];
  estimatedTime: string;
  difficulty: string;
  completed: boolean;
  createdAt: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface GitHubSyncResult {
  skillsDetected: number;
  skills: Skill[];
  repositories: number;
  languageStats: Record<string, number>;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Skills API
  async getSkills(userId: string): Promise<ApiResponse<Skill[]>> {
    return this.request<Skill[]>(`/skills/user/${userId}`);
  }

  async getSkill(skillId: string): Promise<ApiResponse<Skill>> {
    return this.request<Skill>(`/skills/${skillId}`);
  }

  async createSkill(skillData: Partial<Skill>): Promise<ApiResponse<Skill>> {
    return this.request<Skill>("/skills", {
      method: "POST",
      body: JSON.stringify(skillData),
    });
  }

  async updateSkill(
    skillId: string,
    updates: Partial<Skill>,
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/skills/${skillId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteSkill(skillId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/skills/${skillId}`, {
      method: "DELETE",
    });
  }

  async getSkillHealth(skillId: string): Promise<ApiResponse<SkillHealth>> {
    return this.request<SkillHealth>(`/skills/${skillId}/health`);
  }

  // Challenges API
  async generateChallenge(
    skillId: string,
    skillName: string,
    proficiency: number,
  ): Promise<ApiResponse<Challenge>> {
    return this.request<Challenge>("/challenges", {
      method: "POST",
      body: JSON.stringify({ skillId, skillName, proficiency }),
    });
  }

  async getChallenges(skillId: string): Promise<ApiResponse<Challenge[]>> {
    return this.request<Challenge[]>(`/challenges/skill/${skillId}`);
  }

  async generateQuiz(
    skillName: string,
    numQuestions: number = 5,
  ): Promise<ApiResponse<QuizQuestion[]>> {
    return this.request<QuizQuestion[]>(
      `/quiz/${encodeURIComponent(skillName)}?numQuestions=${numQuestions}`,
    );
  }

  // Integrations API
  async syncGitHub(
    userId: string,
    username: string,
    githubToken?: string,
  ): Promise<ApiResponse<GitHubSyncResult>> {
    return this.request<GitHubSyncResult>("/integrations/github", {
      method: "POST",
      body: JSON.stringify({ userId, username, githubToken }),
    });
  }
}

export default new ApiService();

// Export types
export type {
  Skill,
  SkillHealth,
  Challenge,
  QuizQuestion,
  GitHubSyncResult,
  ApiResponse,
};
