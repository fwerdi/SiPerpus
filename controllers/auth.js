const Admin = require("../models/admin.model.js");
const bcrypt = require("bcryptjs");

// 📌 Register Admin
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek apakah username sudah digunakan
    const adminExists = await Admin.findOne({ username });
    if (adminExists) return res.status(400).json({ message: "Username sudah digunakan" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat admin baru
    const admin = new Admin({
      username,
      password: hashedPassword,
    });

    await admin.save();
    res.status(201).json({ message: "Admin berhasil didaftarkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Login Admin
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari admin berdasarkan username
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Username tidak ditemukan" });

    // Cek password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    res.status(200).json({
      message: "Login berhasil",
      admin: {
        _id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};