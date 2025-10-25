const {
  generateChallenge,
  generateQuiz,
} = require("../services/bedrockService");
const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDB = require("../config/dynamodb");
const { CHALLENGES_TABLE } = require("../config/tables");
const { v4: uuidv4 } = require("uuid");

exports.createChallenge = async (req, res) => {
  try {
    const { skillId, skillName, proficiency } = req.body;

    // Generate challenge using Bedrock
    const challengeData = await generateChallenge(skillName, proficiency || 50);

    const challenge = {
      challengeId: uuidv4(),
      skillId,
      ...challengeData,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: CHALLENGES_TABLE,
        Item: challenge,
      }),
    );

    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.generateSkillQuiz = async (req, res) => {
  try {
    const { skillName } = req.params;
    const { numQuestions } = req.query;

    const quiz = await generateQuiz(skillName, parseInt(numQuestions) || 5);

    res.json({ success: true, data: quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getChallengesForSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const result = await dynamoDB.send(
      new QueryCommand({
        TableName: CHALLENGES_TABLE,
        IndexName: "SkillIdIndex",
        KeyConditionExpression: "skillId = :skillId",
        ExpressionAttributeValues: {
          ":skillId": skillId,
        },
      }),
    );

    res.json({ success: true, data: result.Items || [] });
  } catch (error) {
    console.error("Error getting challenges:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
