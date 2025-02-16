const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["guru", "murid"], // Role hanya bisa "guru" atau "murid"
      required: true,
    },
    NIP: {
      type: String,
      required: function () {
        return this.role === "guru";
      },
    },
    NISN: {
      type: String,
      required: function () {
        return this.role === "murid";
      },
    },
    nama: {
      type: String,
      required: true,
    },
    kelas: {
      type: String,
      required: true,
    },
    no_telp: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
