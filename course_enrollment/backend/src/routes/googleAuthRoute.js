const express = require("express");
const router = express.Router();
const {
  googleLoginInit,
  googleLoginCallback,
} = require("../controllers/googleAuthController");

router.get("/google", googleLoginInit);
router.get("/google/callback", googleLoginCallback);

module.exports = router;
