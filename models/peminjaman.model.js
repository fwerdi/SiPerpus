const mongoose = require("mongoose");

const PeminjamanSchema = mongoose.Schema(
  {
    tanggal_pinjam: {
      type: Date,
      required: true,
      default: Date.now,
    },
    tanggal_kembali: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    // nama_user: { 
    //   type: String, 
    //   required: true, 
    // },
    // kelas: {
    //   type: String, 
    //   required: true, 
    // },
    jumlah_buku: {
      type: Number,
      required: true,
      min: 1,
    },
    buku: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Peminjaman = mongoose.model("Peminjaman", PeminjamanSchema);

module.exports = Peminjaman;
