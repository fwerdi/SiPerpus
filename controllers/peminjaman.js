const Peminjaman = require("../models/peminjaman.model");

// GET All Peminjaman
exports.getPeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.find();
    res.status(200).json(peminjaman);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single Peminjaman
exports.getPeminjamanrById = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findById(req.params.id);
    if (!peminjaman) return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE Peminjaman 
exports.createPeminjaman = async (req, res) => {
  try {
    const peminjaman = new Peminjaman(req.body);
    await peminjaman.save();
    res.status(201).json(peminjaman);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE Peminjaman
exports.updatePeminjaman = async (req, res) => {
  try {
    const updatedPeminjaman = await Peminjaman.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPeminjaman) return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
    res.status(200).json(updatedPeminjaman);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE Peminjaman
exports.deletePeminjaman = async (req, res) => {
  try {
    const deletedPeminjaman = await Peminjaman.findByIdAndDelete(req.params.id);
    if (!deletedPeminjaman) return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
    res.status(200).json({ message: "Peminjaman berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
