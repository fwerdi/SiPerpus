const Book = require("../models/book.model");

// GET All Books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single Book
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE Book
exports.createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE Book
exports.updateBook = async (req, res) => {
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

// DELETE Book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/bookController.js
exports.searchBook = async (req, res) => {
  try {
    const keyword = req.query.q;
    const result = await Book.find({
      $or: [
        { no_induk: { $regex: keyword, $options: "i" } },
        { judul: { $regex: keyword, $options: "i" } },
        { penggarang: { $regex: keyword, $options: "i" } },
        { penerbit: { $regex: keyword, $options: "i" } },
        { kota_terbit: { $regex: keyword, $options: "i" } },
        { keadaan_buku: { $regex: keyword, $options: "i" } },
        { asal_terima: { $regex: keyword, $options: "i" } },
        { keterangan: { $regex: keyword, $options: "i" } }
      ],
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
