const express = require("express");
const router = express.Router();
const PengembalianController = require("../controllers/pengembalian.js");

// Routes CRUD Pengembalian
router.get("/", PengembalianController.getPengembalian);
router.get("/:id", PengembalianController.getPengembalianById);
router.post("/", PengembalianController.createPengembalian);
router.put("/:id", PengembalianController.updatePengembalian);
router.delete("/:id", PengembalianController.deletePengembalian);

module.exports = router;
