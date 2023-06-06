const mongoose = require("mongoose");
const customer = require("./customer.js");
const balance = require("./balance.js");
const purchase = require("./purchase.js");
const repay = require("./repay.js");
const transaction = require("./transaction.js");
const { faker: faker_ar } = require("@faker-js/faker/locale/ar");
const { faker } = require("@faker-js/faker");

const dotenv = require("dotenv");
require("dotenv").config();
//connecting to mongodb database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connection succesful");
  });

async function createNewUser() {
  const username = faker_ar.person.firstName();
  const email = faker.internet.email();
  console.log(username);
  const newUser = await customer.create({
    name: username,
    email: email,
    isFunder: true,
    isBuyer: true,
    deposits: [],
  });

  return newUser;
}

async function createNewBalance(newUser) {
  const newBalance = await balance.create({
    owner: newUser.id,
    FullBalance: 0,
    remainingBalance: 0,
    usedBalance: 0,
    deposits: [],
    withdraws: [], // 1 to many
    purchases: [], // many to many
    repays: [], // many to many
  });

  return newBalance;
}

async function createNewDeposit(newUser, newBalance, amount) {
  let fakeAmount = faker.number.int({ min: 1, max: 20 }) * 1000;

  let newTransaction = await transaction.create({
    accountOwner: newUser.id,
    amount: amount,
    type: "deposit",
    balanceID: newBalance.id,
  });

  await balance.findOneAndUpdate(
    { _id: newBalance.id },
    {
      $push: { deposits: newTransaction },
      $inc: { FullBalance: amount },
    }
  );

  return newTransaction;
}

async function createNewWithdrawl(newUser, newBalance, amount) {
  //   let withdrawfakeAmount = faker.number.int({ min: 1, max: amount / 1000 });

  let newWithdrawTransaction = await transaction.create({
    accountOwner: newUser.id,
    amount: amount,
    type: "withdraw",
    balanceID: newBalance.id,
  });

  await balance.findOneAndUpdate(
    { _id: newBalance.id },
    {
      $push: { withdraws: newWithdrawTransaction },
      $inc: { FullBalance: -amount * 1000 },
    }
  );

  return newTransaction;
}

(async () => {
  let amount = faker.number.int({ min: 1, max: 20 }); //By Thousands
  let depositAmount = amount * 1000;
  let withdrawfakeAmount = faker.number.int({ min: 1, max: amount }) * 1000;

  const newUser = await createNewUser();
  const newBalance = await createNewBalance(newUser);
  //
  const newDeposit = await createNewDeposit(newUser, newBalance, depositAmount);

  //   const newWithdrawl = await createNewWithdrawl(newUser, newBalance, withdrawfakeAmount);
  console.log(newUser);
  console.log(newBalance);
  console.log(newDeposit);
})();
