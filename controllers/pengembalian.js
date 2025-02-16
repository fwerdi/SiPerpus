const Pengembalian = require("../models/pengembalian.model");

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
    if (!pengembalian) return res.status(404).json({ message: "Pengembalian tidak ditemukan" });
    res.status(200).json(pengembalian);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE Pengembalian
exports.createPengembalian = async (req, res) => {
  try {
    const pengembalian = new Pengembalian(req.body);
    await pengembalian.save();
    res.status(201).json(pengembalian);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE Pengembalian
exports.updatePengembalian = async (req, res) => {
  try {
    const updatedPengembalian = await Pengembalian.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPengembalian) return res.status(404).json({ message: "Pengembalian tidak ditemukan" });
    res.status(200).json(updatedPengembalian);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE Pengembalian
exports.deletePengembalian = async (req, res) => {
  try {
    const deletedPengembalian = await Pengembalian.findByIdAndDelete(req.params.id);
    if (!deletedPengembalian) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
