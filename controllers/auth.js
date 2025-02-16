const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Username tidak ditemukan" });

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah" });

    res.status(200).json({
      message: "Login berhasil",
      user: {
        _id: user._id,
        role: user.role,
        nama: user.nama,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
