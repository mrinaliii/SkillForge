const {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const dynamoDB = require("../config/dynamodb");
const { SKILLS_TABLE } = require("../config/tables");
const { v4: uuidv4 } = require("uuid");

// Create new skill
exports.createSkill = async (req, res) => {
  try {
    const { userId, name, category, proficiency, lastPracticed } = req.body;

    const skillId = uuidv4();
    const timestamp = new Date().toISOString();

    const skill = {
      skillId,
      userId,
      name,
      category,
      proficiency: proficiency || 100,
      lastPracticed: lastPracticed || timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      decayRate: 0.1, // Default decay rate
    };

    await dynamoDB.send(
      new PutCommand({
        TableName: SKILLS_TABLE,
        Item: skill,
      }),
    );

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    console.error("Error creating skill:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all skills for a user
exports.getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await dynamoDB.send(
      new QueryCommand({
        TableName: SKILLS_TABLE,
        IndexName: "UserIdIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      }),
    );

    res.json({ success: true, data: result.Items || [] });
  } catch (error) {
    console.error("Error getting skills:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single skill
exports.getSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const result = await dynamoDB.send(
      new GetCommand({
        TableName: SKILLS_TABLE,
        Key: { skillId },
      }),
    );

    if (!result.Item) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }

    res.json({ success: true, data: result.Item });
  } catch (error) {
    console.error("Error getting skill:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update skill proficiency
exports.updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { proficiency, lastPracticed } = req.body;

    const timestamp = new Date().toISOString();

    await dynamoDB.send(
      new UpdateCommand({
        TableName: SKILLS_TABLE,
        Key: { skillId },
        UpdateExpression:
          "SET proficiency = :proficiency, lastPracticed = :lastPracticed, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":proficiency": proficiency,
          ":lastPracticed": lastPracticed || timestamp,
          ":updatedAt": timestamp,
        },
      }),
    );

    res.json({ success: true, message: "Skill updated successfully" });
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete skill
exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    await dynamoDB.send(
      new DeleteCommand({
        TableName: SKILLS_TABLE,
        Key: { skillId },
      }),
    );

    res.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Calculate skill health score
exports.calculateHealthScore = async (req, res) => {
  try {
    const { skillId } = req.params;

    const result = await dynamoDB.send(
      new GetCommand({
        TableName: SKILLS_TABLE,
        Key: { skillId },
      }),
    );

    if (!result.Item) {
      return res.status(404).json({ success: false, error: "Skill not found" });
    }

    const skill = result.Item;
    const daysSinceLastPractice = Math.floor(
      (Date.now() - new Date(skill.lastPracticed).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    // Exponential decay formula: P = P0 * e^(-λt)
    const decayedProficiency =
      skill.proficiency * Math.exp(-skill.decayRate * daysSinceLastPractice);
    const healthScore = Math.max(0, Math.min(100, decayedProficiency));

    res.json({
      success: true,
      data: {
        skillId,
        name: skill.name,
        originalProficiency: skill.proficiency,
        currentHealthScore: Math.round(healthScore),
        daysSinceLastPractice,
        status:
          healthScore > 70
            ? "healthy"
            : healthScore > 40
              ? "warning"
              : "critical",
      },
    });
  } catch (error) {
    console.error("Error calculating health score:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
