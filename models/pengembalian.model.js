const mongoose = require("mongoose");

const PengembalianSchema = mongoose.Schema(
  {
    id_peminjaman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "peminjamen",
      required: true,
    },
    tanggal_pengembalian: {
      type: Date,
      required: true,
      default: Date.now,
    },
    terlambat: {
      type: Boolean,
      default: false,
    },
    selisih_hari: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Pengembalian = mongoose.model("Pengembalian", PengembalianSchema);

module.exports = Pengembalian;
