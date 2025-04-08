const express = require("express");
const router = express.Router();
const User = require("../controllers/user.js");

// Routes CRUD Pengembalian
router.get("/", User.getUser);
router.get("/:id", User.getUserById);
router.post("/", User.createUser);
router.put("/:id", User.updateUser);
router.delete("/:id", User.deleteUser);
router.get("/search", User.searchUser);

module.exports = router;
