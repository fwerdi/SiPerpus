const Peminjaman = require("../models/peminjaman.model");
const Buku = require("../models/book.model.js");
const User = require("../models/user.model.js");

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

    // 🔍 Cari user berdasarkan ID
    const userData = await User.findById(user);
    if (!userData) return res.status(404).json({ message: "User tidak ditemukan" });

    // 🔹 Simpan ID dan nama user agar tidak salah
    const peminjaman = new Peminjaman({
      user: userData._id,
      nama_user: userData.nama, // Nama siswa langsung dari database
      kelas: userData.kelas,
      jumlah_buku,
      buku,
      tanggal_kembali,
    });

    // 🔍 Cek dan kurangi stok buku
    for (const bookId of buku) {
      const book = await Buku.findById(bookId);
      if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

      // 🔹 Pastikan stok cukup
      if (book.eks < jumlah_buku) {
        return res.status(400).json({ message: `Stok buku tidak mencukupi! Hanya tersedia ${book.eks}.` });
      }

      // 🔻 Kurangi stok buku
      book.eks -= jumlah_buku;
      await book.save();
    }

    // Simpan data peminjaman
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
    // 🔍 Cari data peminjaman berdasarkan ID
    const peminjaman = await Peminjaman.findById(req.params.id);
    if (!peminjaman) return res.status(404).json({ message: "Peminjaman tidak ditemukan" });

    // 🔄 Kembalikan stok buku sebelum menghapus peminjaman
    for (const bookId of peminjaman.buku) {
      const book = await Buku.findById(bookId);
      if (book) {
        book.eks += peminjaman.jumlah_buku; // Tambah kembali jumlah buku
        await book.save();
      }
    }

    // 🗑 Hapus data peminjaman setelah stok dikembalikan
    await peminjaman.deleteOne();

    res.status(200).json({ message: "Peminjaman berhasil dihapus, stok buku dikembalikan!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
