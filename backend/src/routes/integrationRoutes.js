const express = require("express");
const router = express.Router();
const integrationController = require("../controllers/integrationController");

router.post("/integrations/github", integrationController.syncGitHub);

module.exports = router;
