const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

// Comprehensive skill database with high-quality mock data
const SKILL_DATABASE = {
  javascript: {
    challenges: [
      {
        title: "JavaScript Array Methods Mastery",
        description:
          "Master advanced array manipulation techniques including map, filter, reduce, and modern ES6+ features.",
        requirements: [
          "Implement custom map and filter functions from scratch",
          "Use reduce to solve complex data transformation problems",
          "Apply array destructuring and spread operator effectively",
          "Solve real-world problems using functional programming patterns",
        ],
        estimatedTime: "45 minutes",
        difficulty: "Medium",
      },
      {
        title: "Async JavaScript Challenge",
        description:
          "Deep dive into asynchronous JavaScript with Promises, async/await, and error handling patterns.",
        requirements: [
          "Convert callback-based code to Promise-based solutions",
          "Implement parallel async operations with Promise.all",
          "Create robust error handling for async functions",
          "Build a retry mechanism for failed API calls",
        ],
        estimatedTime: "60 minutes",
        difficulty: "Hard",
      },
    ],
    quizzes: [
      {
        question: "What is the output of: console.log(0.1 + 0.2 === 0.3)?",
        options: ["true", "false", "undefined", "NaN"],
        correctAnswer: 1,
        explanation:
          "Due to floating point precision issues in JavaScript, 0.1 + 0.2 equals approximately 0.30000000000000004, not exactly 0.3.",
      },
      {
        question:
          "Which method creates a new array with results of calling a function on every element?",
        options: ["map()", "filter()", "reduce()", "forEach()"],
        correctAnswer: 0,
        explanation:
          "map() creates a new array populated with results of calling provided function on every element in the calling array.",
      },
      {
        question: "What is a closure in JavaScript?",
        options: [
          "A function with access to its outer function's scope",
          "A way to close browser tabs programmatically",
          "A method for memory management",
          "A type of JavaScript loop",
        ],
        correctAnswer: 0,
        explanation:
          "A closure gives a function access to variables from its outer (enclosing) scope even after the outer function has finished executing.",
      },
    ],
  },

  react: {
    challenges: [
      {
        title: "React Hooks Deep Dive Challenge",
        description:
          "Build a complex React application using advanced hooks patterns and state management strategies.",
        requirements: [
          "Create custom hooks for API calls and local storage management",
          "Implement useReducer for complex state logic with multiple actions",
          "Use useContext for efficient global state management",
          "Optimize performance with useMemo and useCallback hooks",
        ],
        estimatedTime: "90 minutes",
        difficulty: "Hard",
      },
    ],
    quizzes: [
      {
        question: "When should you use the useMemo hook?",
        options: [
          "To optimize expensive calculations and prevent unnecessary re-computation",
          "To manage side effects in functional components",
          "To handle form state and validation",
          "To make API calls and handle responses",
        ],
        correctAnswer: 0,
        explanation:
          "useMemo memoizes expensive calculations to prevent re-computation on every render, improving performance.",
      },
      {
        question: "What is the purpose of keys in React lists?",
        options: [
          "To help React identify which items have changed, are added, or are removed",
          "To style list items with CSS",
          "To add click handlers to list elements",
          "To define the order of list items",
        ],
        correctAnswer: 0,
        explanation:
          "Keys help React track element identity during updates, which is crucial for performance and correct rendering.",
      },
    ],
  },

  python: {
    challenges: [
      {
        title: "Python Data Structures & Algorithms",
        description:
          "Master Python's built-in data structures and solve algorithmic problems using Pythonic approaches.",
        requirements: [
          "Implement complex list and dictionary comprehensions",
          "Use generator expressions for memory-efficient data processing",
          "Solve problems using collections module data structures",
          "Apply algorithmic thinking to real-world scenarios",
        ],
        estimatedTime: "50 minutes",
        difficulty: "Medium",
      },
    ],
    quizzes: [
      {
        question: "How do you create a virtual environment in Python?",
        options: [
          "python -m venv myenv",
          "pip create venv myenv",
          "virtualenv create myenv",
          "env python myenv",
        ],
        correctAnswer: 0,
        explanation:
          "python -m venv myenv creates a virtual environment named 'myenv' in the current directory, isolating package dependencies.",
      },
      {
        question: "What is the difference between lists and tuples in Python?",
        options: [
          "Lists are mutable, tuples are immutable",
          "Tuples are faster than lists for all operations",
          "Lists use parentheses, tuples use square brackets",
          "There is no practical difference",
        ],
        correctAnswer: 0,
        explanation:
          "The main difference is mutability - lists can be modified after creation, while tuples cannot be changed once created.",
      },
    ],
  },

  aws: {
    challenges: [
      {
        title: "AWS Serverless Architecture Design",
        description:
          "Design and implement a complete serverless application using AWS services with proper security and scalability.",
        requirements: [
          "Create Lambda functions for business logic with proper error handling",
          "Set up API Gateway with REST endpoints and request validation",
          "Configure DynamoDB tables with appropriate keys and indexes",
          "Implement secure IAM roles and least privilege permissions",
        ],
        estimatedTime: "120 minutes",
        difficulty: "Hard",
      },
    ],
    quizzes: [
      {
        question: "Which AWS service provides serverless compute capabilities?",
        options: ["AWS Lambda", "Amazon EC2", "Amazon S3", "Amazon RDS"],
        correctAnswer: 0,
        explanation:
          "AWS Lambda runs code without provisioning or managing servers, automatically scaling with workload.",
      },
      {
        question: "What is the primary use case for Amazon S3?",
        options: [
          "Object storage for files and data of any size",
          "Virtual servers in the cloud",
          "Relational database management",
          "Content delivery network services",
        ],
        correctAnswer: 0,
        explanation:
          "Amazon S3 provides scalable object storage for storing and retrieving any amount of data from anywhere on the web.",
      },
    ],
  },
};

// Intelligent challenge generator
function generateMockChallenge(skillName, proficiencyLevel) {
  const lowerSkill = skillName.toLowerCase();

  // Find exact or partial skill match
  for (const [skill, data] of Object.entries(SKILL_DATABASE)) {
    if (lowerSkill.includes(skill)) {
      const challenges = data.challenges;
      // Select challenge based on proficiency level
      const challengeIndex =
        proficiencyLevel > 70 ? Math.min(1, challenges.length - 1) : 0;
      return {
        ...challenges[challengeIndex],
        skillName: skillName,
        proficiencyLevel: proficiencyLevel,
      };
    }
  }

  // Generic challenge for unknown skills
  const difficulty =
    proficiencyLevel > 80 ? "Hard" : proficiencyLevel > 60 ? "Medium" : "Easy";
  const time = proficiencyLevel > 70 ? "60 minutes" : "45 minutes";

  return {
    title: `${skillName} Skill Development Challenge`,
    description: `Enhance your ${skillName} skills with this comprehensive practice challenge designed for ${difficulty.toLowerCase()} proficiency level. Apply core concepts and best practices to solve real-world problems.`,
    requirements: [
      "Review fundamental concepts and documentation",
      "Implement practical examples and exercises",
      "Test your solutions thoroughly with various scenarios",
      "Document your approach, challenges, and key learnings",
    ],
    estimatedTime: time,
    difficulty: difficulty,
    skillName: skillName,
    proficiencyLevel: proficiencyLevel,
  };
}

// Intelligent quiz generator
function generateMockQuiz(skillName, numQuestions = 5) {
  const lowerSkill = skillName.toLowerCase();

  // Find skill-specific questions
  for (const [skill, data] of Object.entries(SKILL_DATABASE)) {
    if (lowerSkill.includes(skill)) {
      return data.quizzes.slice(0, numQuestions);
    }
  }

  // Generic questions for unknown skills
  return [
    {
      question: `What is the primary application of ${skillName} in modern software development?`,
      options: [
        "Building scalable web applications and services",
        "Data analysis, processing, and visualization",
        "Infrastructure automation and DevOps practices",
        "All of the above applications",
      ],
      correctAnswer: 3,
      explanation: `${skillName} is a versatile technology used across multiple domains including web development, data science, and infrastructure management.`,
    },
    {
      question: `Which fundamental concept is most critical when mastering ${skillName}?`,
      options: [
        "Understanding core syntax and language features",
        "Learning design patterns and architectural best practices",
        "Knowing the ecosystem, tools, and community resources",
        "All concepts are equally important for comprehensive mastery",
      ],
      correctAnswer: 3,
      explanation:
        "True mastery requires understanding syntax, design patterns, and ecosystem tools to build effective and maintainable solutions.",
    },
    {
      question: `What should be your primary consideration when deploying ${skillName} in production?`,
      options: [
        "Performance optimization and scalability",
        "Security practices and vulnerability prevention",
        "Code maintainability and team collaboration",
        "All of the above considerations are crucial",
      ],
      correctAnswer: 3,
      explanation:
        "Production deployment requires balanced attention to performance, security, and maintainability for successful long-term operation.",
    },
  ].slice(0, numQuestions);
}

// Main functions with automatic fallback to mock data
async function generateChallenge(skillName, proficiencyLevel) {
  try {
    // Try Bedrock first
    const prompt = `Create a coding challenge for ${skillName} at proficiency level ${proficiencyLevel}/100.
Return ONLY valid JSON with these exact fields:
{
  "title": "Challenge title",
  "description": "Challenge description",
  "requirements": ["req1", "req2", "req3"],
  "estimatedTime": "30-45 minutes",
  "difficulty": "Easy/Medium/Hard"
}`;

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    };

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    console.log("Attempting Bedrock challenge generation...");
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const resultText = responseBody.content[0].text;

    const cleanedText = resultText.replace(/```json|```/g, "").trim();
    const challenge = JSON.parse(cleanedText);

    console.log("✅ Bedrock challenge generated successfully");
    return challenge;
  } catch (error) {
    console.log(
      "🔄 Bedrock unavailable, using intelligent mock data for challenge",
    );
    return generateMockChallenge(skillName, proficiencyLevel);
  }
}

async function generateQuiz(skillName, numQuestions = 5) {
  try {
    const prompt = `Generate ${numQuestions} multiple-choice quiz questions about ${skillName} for software developers.
Return ONLY valid JSON array in this exact format:
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation here"
  }
]`;

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    };

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    console.log("Attempting Bedrock quiz generation...");
    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const resultText = responseBody.content[0].text;

    const cleanedText = resultText.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleanedText);

    console.log("✅ Bedrock quiz generated successfully");
    return questions;
  } catch (error) {
    console.log("🔄 Bedrock unavailable, using intelligent mock data for quiz");
    return generateMockQuiz(skillName, numQuestions);
  }
}

module.exports = { generateChallenge, generateQuiz };
