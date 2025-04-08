const Pengembalian = require("../models/pengembalian.model.js");
const Peminjaman = require("../models/peminjaman.model");


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

exports.createPengembalian = async (req, res) => {
  try {
    const { id_peminjaman, tanggal_pengembalian } = req.body;

    const peminjaman = await Peminjaman.findById(id_peminjaman).populate("buku");
    if (!peminjaman) {
      return res.status(404).json({ message: "Peminjaman tidak ditemukan" });
    }

    // 📌 Tanggal yang seharusnya dikembalikan
    const tanggalKembali = peminjaman.tanggal_kembali;

    // 📆 Tanggal saat ini sebagai tanggal pengembalian
    const tanggalPengembalian = new Date();

    // 🚨 Cek keterlambatan
    let terlambat = false;
    let selisihHari = 0;

    if (tanggalPengembalian > tanggalKembali) {
      terlambat = true;
      selisihHari = Math.ceil((tanggalPengembalian - tanggalKembali) / (1000 * 60 * 60 * 24)); // Konversi ms ke hari
    }

    // 📌 Simpan pengembalian
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
      keterlambatan: terlambat ? `Terlambat ${selisihHari} hari` : "Tepat waktu",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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


exports.searchPengembalian = async (req, res) => {
  try {
    const keyword = req.query.q;
    const result = await Pengembalian.find({
      $or: [
        { id_peminjaman: { $regex: keyword, $options: "i" } },
        { tanggal_pengembalian: { $regex: keyword, $options: "i" } },
      ],
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
