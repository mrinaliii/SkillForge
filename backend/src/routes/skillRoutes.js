const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");

router.post("/skills", skillController.createSkill);
router.get("/skills/user/:userId", skillController.getUserSkills);
router.get("/skills/:skillId", skillController.getSkill);
router.put("/skills/:skillId", skillController.updateSkill);
router.delete("/skills/:skillId", skillController.deleteSkill);
router.get("/skills/:skillId/health", skillController.calculateHealthScore);

module.exports = router;
