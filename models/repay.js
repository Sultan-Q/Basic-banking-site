const mongoose = require("mongoose");

const repaySchema = mongoose.Schema({
  purchaseID: {
    type: String,
    required: true,
  },
  madeBy: {
    type: mongoose.Schema.ObjectId,
    ref: "customer",
  }, // 1 to 1
  fullAmount: {
    type: Number,
    required: true,
  }, // upadated frequently
  paymentAmount: {
    type: Number,
    required: true,
  }, // upadated frequently
  balances: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "balance",
    },
  ], // 1 to many
  paid: {
    type: Boolean,
    default: false,
  },
  nextDueDate: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("repay", repaySchema);
