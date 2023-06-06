const mongoose = require("mongoose");

const balanceSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "customer",
  }, // 1 to 1
  FullBalance: {
    type: Number,
    required: true,
  }, // upadated frequently
  remainingBalance: {
    type: Number,
    required: true,
  }, // upadated frequently
  usedBalance: {
    type: Number,
    required: true,
  }, // upadated frequently
  deposits: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "transaction",
    },
  ], // 1 to many
  withdraws: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "transaction",
    },
  ], // 1 to many
  purchases: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "purachase",
    },
  ], // many to many

  investPerBalance: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "investPerBalance",
    },
  ], // many to many
});

module.exports = mongoose.model("balance", balanceSchema);
