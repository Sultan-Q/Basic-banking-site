const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("transaction", transactionSchema);
