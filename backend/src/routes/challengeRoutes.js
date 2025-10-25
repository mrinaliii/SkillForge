const express = require("express");
const router = express.Router();
const challengeController = require("../controllers/challengeController");

router.post("/challenges", challengeController.createChallenge);
router.get(
  "/challenges/skill/:skillId",
  challengeController.getChallengesForSkill,
);
router.get("/quiz/:skillName", challengeController.generateSkillQuiz);

module.exports = router;
