const {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "ap-south-1" });

async function createTables() {
  const tables = [
    {
      TableName: "SkillForge-Skills",
      KeySchema: [{ AttributeName: "skillId", KeyType: "HASH" }],
      AttributeDefinitions: [
        { AttributeName: "skillId", AttributeType: "S" },
        { AttributeName: "userId", AttributeType: "S" },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "UserIdIndex",
          KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
    {
      TableName: "SkillForge-Users",
      KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
    {
      TableName: "SkillForge-Challenges",
      KeySchema: [{ AttributeName: "challengeId", KeyType: "HASH" }],
      AttributeDefinitions: [
        { AttributeName: "challengeId", AttributeType: "S" },
        { AttributeName: "skillId", AttributeType: "S" },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "SkillIdIndex",
          KeySchema: [{ AttributeName: "skillId", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  ];

  for (const tableConfig of tables) {
    try {
      console.log(`Creating table: ${tableConfig.TableName}...`);
      await client.send(new CreateTableCommand(tableConfig));
      console.log(`✅ Table ${tableConfig.TableName} created successfully`);
    } catch (error) {
      if (error.name === "ResourceInUseException") {
        console.log(`ℹ️  Table ${tableConfig.TableName} already exists`);
      } else {
        console.error(
          `❌ Error creating table ${tableConfig.TableName}:`,
          error.message,
        );
      }
    }
  }

  // List all tables
  const listResult = await client.send(new ListTablesCommand({}));
  console.log("\n📊 All DynamoDB Tables:", listResult.TableNames);
}

createTables();
