const express = require("express");
const router = express.Router();

const customer = require("../models/customer.js");
const transaction = require("../models/transaction.js");
const customerdata = require("../models/customerdetails.js");
const balance = require("../models/balance.js");

router.get("/", async (req, res) => {
  // const allCustomers = await customer.find({}).populate("deposits").exec();

  // if (!allCustomers || allCustomers == []) {
  // } else {
  //   // let result = allCustomers.map(({ foo }) => foo.amount)
  //   // console.log(allCustomers);
  //   let totalAmount = 0;
  //   allCustomers.forEach(function (customer) {
  //     const sum = customer.deposits
  //       .filter((account) => account.type === "deposit")
  //       .map((account) => account.amount)
  //       .reduce((a, b) => a + b, 0);
  //     totalAmount = totalAmount + sum;
  //   });
  //   console.log("depositsss", totalAmount);

  // let totalAmount = allCustomers.reduce((n, { amount }) => n + amount, 0);
  const totalAmount = 1000;
  res.render("home", { totalAmount, title: "-" });

  // res.render("deposit", { customers: allCustomers, title: "home" });
  // }
});

router.get("/transferhistory", async (req, res) => {
  const transfers = await transaction.find({});
  // transaction.find({}, (err, transfers) => {
  // });
  res.render("transferhistory", {
    title: "Transfer history",
    transferList: transfers,
  });
});

router.get("/customers", async (req, res) => {
  // const customers = await customer.find({}).populate("deposits").exec();
  const customers = await customer.find({});
  // console.log(JSON.stringify(customers));
  if (customers.length === 0) {
    const vv = customer.insertMany(customerdata);
    // customer.insertMany(customerdata, (err) => {
    //   if (err) {
    //     console.log(err);
    //   } else console.log("Customers added Successfully ");
    // });
    res.redirect("/customers");
  } else {
    res.render("customers", {
      customersList: customers,
      title: "Users",
    });
  }
  // customer.find({}, (err, customers) => {
  //   if (customers.length === 0) {
  //     customer.insertMany(customerdata, (err) => {
  //       if (err) {
  //         console.log(err);
  //       } else console.log("Customers added Successfully ");
  //     });
  //     res.redirect("/customers");
  //   } else {
  //     res.render("customers", {
  //       customersList: customers,
  //       title: "Users",
  //     });
  //   }
  // });
});

router.get("/customers/:customerId", async (req, res) => {
  const id = req.params.customerId;
  const Findcustomer = await customer.findOne({ _id: id });
  if (!customer) {
  } else {
    const findTransacions = await transaction.find({ accountOwner: id });

    res.render("customerinfo", {
      customer: Findcustomer,
      transactions: findTransacions,
      title: "Customer",
    });
  }
});

router.get("/transfer", async (req, res) => {
  const endCustomer = await customer.find({});

  if (!endCustomer) {
  } else {
    res.render("transfer", { title: "Transfer" });
  }
  // customer.find({}, (err, docs) => {
  // });
});

router.get("/newUser", async (req, res) => {
  const endCustomer = await customer.find({});

  if (!endCustomer) {
  } else {
    res.render("newUser", { title: "newUser" });
  }
  // customer.find({}, (err, docs) => {
  // });
});

router.post("/newUser", async (req, res) => {
  try {
    name = req.body.name;
    email = req.body.email;

    await customer.create({
      name: name,
      email: email,
    });

    res.redirect("/customers");
  } catch (error) {
    console.log(error);
  }
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

router.get("/deposit", async (req, res) => {
  const allCustomers = await customer.find({});

  if (!allCustomers || allCustomers == []) {
  } else {
    res.render("deposit", { customers: allCustomers, title: "deposit" });
  }
  // customer.find({}, (err, docs) => {
  // });
});
router.post("/deposit", async (req, res) => {
  console.log(req.body);
  const user = await customer.findById(req.body.id);
  console.log(user);

  const newTrans = await transaction.create({
    accountOwner: user.id,
    amount: parseInt(req.body.amount),
    type: "deposit",
  });

  const getBalance = await balance.findOne({ owner: user.id });
  getBalance.deposits.push(newTrans.id);

  getBalance.save();
  console.log(newTrans);
  res.redirect("/customers");

  // customer.find({}, (err, docs) => {
  // });
});
module.exports = router;
