const mongoose = require("mongoose");

const purchaseSchema = mongoose.Schema({
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
  afterinvestAmount: {
    type: Number,
    required: true,
  }, // upadated frequently
  investPerBalance: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "investPerBalance",
    },
  ], // 1 to many
  paidAmount: {
    type: Number,
    required: true,
  }, // upadated frequently
  paymentsDone: {
    type: Number,
    required: true,
  }, // upadated frequently
  paymentsLeft: {
    type: Number,
    required: true,
  }, // upadated frequently
  paymentDates: [
    {
      type: String,
      required: true,
    },
  ], // 1 to many
  nextDueDate: {
    type: String,
    required: true,
  },
  stillOpen: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("purchase", purchaseSchema);
