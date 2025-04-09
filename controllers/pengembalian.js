const Pengembalian = require("../models/pengembalian.model.js");
const Peminjaman = require("../models/peminjaman.model");
const mongoose = require("mongoose");
const Book = require("../models/book.model");

// GET All Pengembalian
exports.getPengembalian = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.find();
    res.status(200).json(pengembalian);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single Pengembalian
exports.getPengembalianById = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.findById(req.params.id);
    if (!pengembalian)
      return res.status(404).json({ message: "Pengembalian tidak ditemukan" });
    res.status(200).json(pengembalian);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPengembalian = async (req, res) => {
  try {
    const { id_peminjaman } = req.body;

    // 🔍 Ambil data peminjaman dan populate data buku
    const peminjaman = await Peminjaman.findById(id_peminjaman).populate(
      "buku"
    );
    if (!peminjaman) {
      return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
    }

    // 📌 Tanggal yang seharusnya dikembalikan
    const tanggalKembali = peminjaman.tanggal_kembali;

    // 📆 Tanggal pengembalian (sekarang)
    const tanggalPengembalian = new Date();

    // 🚨 Cek keterlambatan
    let terlambat = false;
    let selisihHari = 0;

    if (tanggalPengembalian > tanggalKembali) {
      terlambat = true;
      selisihHari = Math.ceil(
        (tanggalPengembalian - tanggalKembali) / (1000 * 60 * 60 * 24)
      );
    }

    // 📘 Tambahkan kembali jumlah eks buku
    const buku = await Book.findById(peminjaman.buku);
    if (!buku) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    const jumlahDipinjam = peminjaman.jumlah || 1; // fallback ke 1 jika undefined/null

    buku.eks = (buku.eks || 0) + jumlahDipinjam;
    await buku.save();

    // 💾 Simpan data pengembalian
    const pengembalian = new Pengembalian({
      id_peminjaman: peminjaman._id,
      tanggal_pengembalian: tanggalPengembalian,
      terlambat,
      selisih_hari: selisihHari,
    });

    await pengembalian.save();

    res.status(201).json({
      message: "Pengembalian berhasil!",
      pengembalian,
      keterlambatan: terlambat
        ? `Terlambat ${selisihHari} hari`
        : "Tepat waktu",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Pengembalian
exports.updatePengembalian = async (req, res) => {
  try {
    const updatedPengembalian = await Pengembalian.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedPengembalian)
      return res.status(404).json({ message: "Pengembalian tidak ditemukan" });
    res.status(200).json(updatedPengembalian);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE Pengembalian
exports.deletePengembalian = async (req, res) => {
  try {
    const deletedPengembalian = await Pengembalian.findByIdAndDelete(
      req.params.id
    );
    if (!deletedPengembalian)
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchPengembalian = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required." });
    }

    const keyword = q.toLowerCase();

    const searchConditions = [];

    // id_peminjaman
    searchConditions.push({
      id_peminjaman: { $regex: keyword, $options: "i" },
    });

    // terlambat
    if (keyword === "true" || keyword === "false") {
      searchConditions.push({ terlambat: keyword === "true" });
    }

    // selisih_hari (pastikan keyword adalah angka)
    const numberValue = Number(keyword);
    if (!isNaN(numberValue)) {
      searchConditions.push({ selisih_hari: numberValue });
    }

    // tanggal_pengembalian (cek apakah keyword bisa dikonversi ke tanggal valid)
    const parsedDate = new Date(keyword);
    if (!isNaN(parsedDate.getTime())) {
      // cari data dengan tanggal yang sama (tanpa memperhatikan jam)
      const nextDay = new Date(parsedDate);
      nextDay.setDate(parsedDate.getDate() + 1);

      searchConditions.push({
        tanggal_pengembalian: {
          $gte: parsedDate,
          $lt: nextDay,
        },
      });
    }

    const pengembalians = await Pengembalian.find({ $or: searchConditions });

    res.status(200).json(pengembalians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
