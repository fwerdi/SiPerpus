const Book = require("../models/book.model");

const searchBook = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required." });
    }

    const keyword = q.toLowerCase();
    const conditions = [];

    const stringFields = [
      "no_induk",
      "tanggal_pembukuan",
      "judul",
      "penggarang",
      "penerbit",
      "kota_terbit",
      "tanggal_penyerahan",
      "keadaan_buku",
      "harga_satuan",
      "asal_terima",
      "keterangan",
    ];

    stringFields.forEach((field) => {
      conditions.push({ [field]: { $regex: keyword, $options: "i" } });
    });

    const numberKeyword = Number(q);
    if (!isNaN(numberKeyword)) {
      conditions.push({ no_klas: numberKeyword });
      conditions.push({ eks: numberKeyword });
    }

    if (keyword === "true" || keyword === "false") {
      conditions.push({ status: keyword === "true" });
    }

    const books = await Book.find({ $or: conditions });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export semua fungsi secara konsisten
module.exports = {
  searchBook,
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
