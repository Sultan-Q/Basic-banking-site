const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  accountOwner: {
    type: mongoose.Schema.ObjectId,
    ref: "customer",
  },
  amount: {
    type: Number,
    required: true,
  },
  type: { type: String, enum: ["deposit", "withdraw"] },
  balanceID: {
    type: mongoose.Schema.ObjectId,
    ref: "balance",
  },
});

module.exports = mongoose.model("transaction", transactionSchema);
