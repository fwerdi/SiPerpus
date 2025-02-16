const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/auth.js");

// Route untuk Login User
router.post("/login", loginUser);

module.exports = router;
