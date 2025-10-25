const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDB = require("../config/dynamodb");
const { SKILLS_TABLE } = require("../config/tables");
const { v4: uuidv4 } = require("uuid");

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || "us-east-1",
});

exports.syncGitHub = async (req, res) => {
  try {
    const { userId, username, githubToken } = req.body;

    if (!username) {
      return res
        .status(400)
        .json({ success: false, error: "GitHub username required" });
    }

    // Invoke Lambda function
    const command = new InvokeCommand({
      FunctionName: "skillforge-github-scraper",
      Payload: JSON.stringify({ username, githubToken }),
    });

    const lambdaResponse = await lambdaClient.send(command);
    const payload = JSON.parse(
      new TextDecoder().decode(lambdaResponse.Payload),
    );
    const result = JSON.parse(payload.body);

    if (!result.success) {
      throw new Error(result.error);
    }

    // Save detected skills to DynamoDB
    const savedSkills = [];
    for (const skill of result.data.skills) {
      const skillData = {
        skillId: uuidv4(),
        userId,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        lastPracticed: skill.lastPracticed,
        source: "GitHub",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        decayRate: 0.1,
      };

      await dynamoDB.send(
        new PutCommand({
          TableName: SKILLS_TABLE,
          Item: skillData,
        }),
      );

      savedSkills.push(skillData);
    }

    res.json({
      success: true,
      data: {
        skillsDetected: savedSkills.length,
        skills: savedSkills,
        repositories: result.data.repositories,
        languageStats: result.data.languageStats,
      },
    });
  } catch (error) {
    console.error("Error syncing GitHub:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
