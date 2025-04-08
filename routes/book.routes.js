// routes/buku.js
const express = require("express");
const router = express.Router();
const BukuController = require("../controllers/book.js");

router.get("/", BukuController.getBooks);
router.get("/search", BukuController.searchBook);
router.get("/:id", BukuController.getBookById);
router.post("/", BukuController.createBook);
router.put("/:id", BukuController.updateBook);
router.delete("/:id", BukuController.deleteBook);

module.exports = router;