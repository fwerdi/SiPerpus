const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");

const router = express.Router();

// 📌 1️⃣ Tambah User (Guru/Murid)
router.post("/", async (req, res) => {
  try {
    const { role, NIP, NISN, nama, kelas, no_telp, username, password } = req.body;

    // Validasi role
    if (!["guru", "murid"].includes(role)) {
      return res.status(400).json({ message: "Role harus guru atau murid" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = new User({
      role,
      NIP: role === "guru" ? NIP : undefined,
      NISN: role === "murid" ? NISN : undefined,
      nama,
      kelas,
      no_telp,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User berhasil ditambahkan", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});

//  Get Semua User
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});

//  Get User by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});

//  Update User by ID
router.put("/:id", async (req, res) => {
  try {
    const { nama, kelas, no_telp, username, password } = req.body;
    let updatedData = { nama, kelas, no_telp, username };

    // Hash password jika diperbarui
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({ message: "User berhasil diperbarui", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});

//  Hapus User by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
});

module.exports = router;
