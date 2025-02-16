const express = require("express");

const {
  getAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/admin");

const router = express.Router();

// Mendapatkan semua buku
router.get("/", getAdmin);

// Mendapatkan buku berdasarkan ID
router.get("/:id", getAdminById);

// Menambahkan buku baru
router.post("/", createAdmin);

// Mengupdate buku berdasarkan ID
router.put("/:id", updateAdmin);

// Menghapus buku berdasarkan ID
router.delete("/:id", deleteAdmin);

module.exports = router