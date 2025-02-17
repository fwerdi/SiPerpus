const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.js");

const router = express.Router();

// 📌 Register dan Login
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
