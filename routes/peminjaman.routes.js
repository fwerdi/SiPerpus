const express = require("express");
const router = express.Router();
const PeminjamanController = require("../controllers/peminjaman.js");

// GET semua data peminjaman
router.get("/", PeminjamanController.getPeminjaman);

// GET satu data peminjaman berdasarkan ID
router.get("/:id", PeminjamanController.getPeminjamanrById);

// POST (Create) peminjaman baru
router.post("/", PeminjamanController.createPeminjaman);

// PUT (Update) peminjaman berdasarkan ID
router.put("/:id", PeminjamanController.updatePeminjaman);

// DELETE peminjaman berdasarkan ID
router.delete("/:id", PeminjamanController.deletePeminjaman);

router.get("/search", PeminjamanController.searchPeminjaman);

module.exports = router;
