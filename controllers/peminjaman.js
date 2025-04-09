const Peminjaman = require("../models/peminjaman.model.js");
const Buku = require("../models/book.model.js");
const User = require("../models/user.model.js");
const mongoose = require("mongoose");

// SEARCH Peminjaman
exports.searchPeminjaman = async (req, res) => {
  try {
    const { keyword } = req.query;

    // Cari peminjaman dan populate user & buku
    const peminjaman = await Peminjaman.find()
      .populate("user")
      .populate("buku");

    // Filter manual berdasarkan keyword
    const filtered = peminjaman.filter((item) => {
      const userMatch =
        item.user &&
        item.user.toString().toLowerCase().includes(keyword.toLowerCase());

      const tanggalPinjamMatch = item.tanggal_pinjam
        ?.toISOString()
        .toLowerCase()
        .includes(keyword.toLowerCase());

      const tanggalKembaliMatch = item.tanggal_kembali
        ?.toISOString()
        .toLowerCase()
        .includes(keyword.toLowerCase());

      const bukuMatch = item.buku.some((b) =>
        b.judul?.toLowerCase().includes(keyword.toLowerCase())
      );

      return userMatch || tanggalPinjamMatch || tanggalKembaliMatch || bukuMatch;
    });

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//GET Single Peminjaman
exports.getPeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.find();
    res.status(200).json(peminjaman);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single Peminjaman
exports.getPeminjamanById = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findById(req.params.id);
    if (!peminjaman)
      return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
    res.status(200).json(peminjaman);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPeminjaman = async (req, res) => {
  try {
    const { user, jumlah_buku, buku, tanggal_kembali } = req.body;

    const userData = await User.findById(user);
    if (!userData) return res.status(404).json({ message: "User tidak ditemukan" });

    const peminjaman = new Peminjaman({
      user: userData._id,
      jumlah_buku,
      buku,
      tanggal_kembali,
    });

    for (const bookId of buku) {
      const book = await Buku.findById(bookId);
      if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

      if (book.eks < jumlah_buku) {
        return res.status(400).json({ message: `Stok buku tidak mencukupi! Hanya tersedia ${book.eks}.` });
      }

      book.eks -= jumlah_buku;
      await book.save();
    }

    await peminjaman.save();
    res.status(201).json({ message: "Peminjaman berhasil!", peminjaman });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE Peminjaman
exports.updatePeminjaman = async (req, res) => {
  try {
    const updatedPeminjaman = await Peminjaman.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedPeminjaman)
      return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
    res.status(200).json(updatedPeminjaman);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findById(req.params.id);
    if (!peminjaman) return res.status(404).json({ message: "Peminjaman tidak ditemukan" });

    for (const bookId of peminjaman.buku) {
      const book = await Buku.findById(bookId);
      if (book) {
        book.eks += peminjaman.jumlah_buku;
        await book.save();
      }
    }

    await peminjaman.deleteOne();
    res.status(200).json({ message: "Peminjaman berhasil dihapus, stok buku dikembalikan!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

