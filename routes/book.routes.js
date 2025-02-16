const express = require("express");

const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/book");

const router = express.Router();

// Mendapatkan semua buku
router.get("/", getBooks);

// Mendapatkan buku berdasarkan ID
router.get("/:id", getBookById);

// Menambahkan buku baru
router.post("/", createBook);

// Mengupdate buku berdasarkan ID
router.put("/:id", updateBook);

// Menghapus buku berdasarkan ID
router.delete("/:id", deleteBook);

module.exports = router