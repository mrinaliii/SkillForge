const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

// Use us-east-1 for Bedrock (not available in ap-south-1 yet)
const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function generateChallenge(skillName, proficiencyLevel) {
  const prompt = `Generate a coding challenge for skill: ${skillName}
Proficiency level: ${proficiencyLevel}/100

Create a practical challenge that helps refresh this skill. Include:
1. Challenge title
2. Description (2-3 sentences)
3. Requirements (3-4 bullet points)
4. Estimated time to complete
5. Difficulty level (Easy/Medium/Hard)

Format as JSON with this structure:
{
  "title": "Challenge title here",
  "description": "Description here",
  "requirements": ["req1", "req2", "req3"],
  "estimatedTime": "30 minutes",
  "difficulty": "Medium"
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

  try {
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    // Parse the JSON from Claude's response
    const challengeText = responseBody.content[0].text;

    // Try to parse JSON, if fails return as plain text
    try {
      return JSON.parse(challengeText);
    } catch {
      // If not valid JSON, create structured response
      return {
        title: `${skillName} Refresh Challenge`,
        description: challengeText.substring(0, 200),
        requirements: [
          "Complete the challenge",
          "Test your solution",
          "Review and improve",
        ],
        estimatedTime: "30 minutes",
        difficulty: proficiencyLevel > 70 ? "Medium" : "Easy",
      };
    }
  } catch (error) {
    console.error("Bedrock error:", error);
    throw new Error(`Failed to generate challenge: ${error.message}`);
  }
}

async function generateQuiz(skillName, numQuestions = 5) {
  const prompt = `Generate ${numQuestions} quiz questions for: ${skillName}

Create multiple-choice questions that test understanding. Return ONLY valid JSON (no markdown, no extra text) in this exact format:

[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation of the correct answer"
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

  try {
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-haiku-20240307-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    const quizText = responseBody.content[0].text;

    // Clean up markdown code blocks if present
    let cleanedText = quizText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Bedrock error:", error);
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
}

module.exports = { generateChallenge, generateQuiz };
