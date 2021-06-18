const express = require("express");
const router = express.Router();

const customer = require("../models/customer.js");
const transaction = require("../models/transaction.js");
const customerdata = require("../models/customerdetails.js");

router.get("/", (req, res) => {
  res.render("home", { title: "Y.K Bank" });
});

router.get("/transferhistory", (req, res) => {
  transaction.find({}, (err, transfers) => {
    res.render("transferhistory", {
      title: "Transfer history",
      transferList: transfers,
    });
  });
});

router.get("/customers", (req, res) => {
  customer.find({}, (err, customers) => {
    if (customers.length === 0) {
      customer.insertMany(customerdata, (err) => {
        if (err) {
          console.log(err);
        } else console.log("Customers added Successfully ");
      });
      res.redirect("/customers");
    } else {
      res.render("customers", {
        customersList: customers,
        title: "Users",
      });
    }
  });
});

router.get("/customers/:customerId", (req, res) => {
  const id = req.params.customerId;
  customer.findOne({ _id: id }, (err, info) => {
    res.render("customerinfo", { customer: info, title: "Customer" });
  });
});

router.get("/transfer", (req, res) => {
  customer.find({}, (err, docs) => {
    res.render("transfer", { title: "Transfer" });
  });
});

router.post("/transfer", async (req, res) => {
  try {
    myAccount = req.body.senderName;
    clientAccount = req.body.receiverName;
    transferBal = req.body.amount;
    const transferBalAmt = parseInt(transferBal);
    const user1 = await customer.findOne({ name: myAccount });
    const user2 = await customer.findOne({ name: clientAccount });
    const moneyTransfered = parseInt(user2.amount) + parseInt(transferBal);
    const moneywithdrawn = parseInt(user1.amount) - parseInt(transferBal);

    await customer.findOneAndUpdate(
      { name: clientAccount },
      { amount: moneyTransfered }
    );
    await customer.findOneAndUpdate(
      { name: myAccount },
      { amount: moneywithdrawn }
    );

    await transaction.create({
      sender: user1.name,
      receiver: user2.name,
      amount: transferBalAmt,
    });
    res.redirect("/customers");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
