const customer = require("../models/customer.js");

const c1 = new customer({
  name: "Yashit",
  email: "yashit12@gmail.com",
  amount: 20000,
});

const c2 = new customer({
  name: "Abhishek",
  email: "abhishek_2@gmail.com",
  amount: 90000,
});

const c3 = new customer({
  name: "Naveen",
  email: "naveenkr33@gmail.com",
  amount: 18000,
});

const c4 = new customer({
  name: "Rajesh",
  email: "Rajeshkr25@hotmail.com",
  amount: 33000,
});

const c5 = new customer({
  name: "Manya",
  email: "manya22@gmail.com",
  amount: 92000,
});

const c6 = new customer({
  name: "Ravi",
  email: "ravi_20@yahoo.com",
  amount: 15000,
});

const c7 = new customer({
  name: "Aakash",
  email: "aakashgp27@gmail.com",
  amount: 73000,
});

const c8 = new customer({
  name: "Vinayak",
  email: "Vinayak2@gmail.com",
  amount: 88000,
});

const c9 = new customer({
  name: "Aman",
  email: "aman_5@gmail.com",
  amount: 36000,
});

const c10 = new customer({
  name: "Bhavya",
  email: "Bhavya10@yahoo.com",
  amount: 90000,
});

module.exports = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];