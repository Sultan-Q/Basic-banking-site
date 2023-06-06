const mongoose = require("mongoose");

var customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  isFunder: {
    type: Boolean,
    required: true,
    default: false,
  },
  isBuyer: {
    type: String,
    required: true,
    default: true,
  },
  balance: {
    type: mongoose.Schema.ObjectId,
    ref: "balance",
  }, // 1 to 1
  // deposits: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "transaction",
  //   },
  // ],
});

module.exports = mongoose.model("customer", customerSchema);
