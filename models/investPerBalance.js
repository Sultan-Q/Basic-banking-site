const mongoose = require("mongoose");

const investPerBalanceSchema = mongoose.Schema({
  madeBy: {
    type: mongoose.Schema.ObjectId,
    ref: "customer",
  }, // 1 to 1
  investAmount: {
    type: Number,
    required: true,
  }, // upadated frequently
  balance: {
    type: mongoose.Schema.ObjectId,
    ref: "balance",
  }, // 1 to many
  balanceValue: {
    type: Number,
    required: true,
  }, // upadated frequently
  purchase: {
    type: mongoose.Schema.ObjectId,
    ref: "purchase",
  }, // 1 to many
});

module.exports = mongoose.model("investPerBalance", investPerBalanceSchema);
