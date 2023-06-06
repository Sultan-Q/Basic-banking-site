const mongoose = require("mongoose");
const customer = require("./customer.js");
const balance = require("./balance.js");
const purchase = require("./purchase.js");
const investPerBalance = require("./investPerBalance.js");

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

async function createRandomUser() {
  const username = faker_ar.person.firstName();
  const email = faker.internet.email();
  console.log(faker.datatype.boolean());
  const newUser = await customer.create({
    name: username,
    isFunder: faker.datatype.boolean(),
    isBuyer: true,
    email: email,
  });

  return newUser;
}

async function createNewBalance(newUser) {
  const newBalance = await balance.create({
    owner: newUser.id,
    FullBalance: 0,
    remainingBalance: 0,
    usedBalance: 0,
    isFunder: true,
    isBuyer: true,
    deposits: [],
    withdraws: [], // 1 to many
    purchases: [], // many to many
    repays: [], // many to many
  });
  await customer.findOneAndUpdate(
    { _id: newUser.id },
    {
      balance: newBalance.id,
    }
  );

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
      $inc: { FullBalance: amount, remainingBalance: amount },
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

async function getRandomFunder() {
  //   let withdrawfakeAmount = faker.number.int({ min: 1, max: amount / 1000 });
  // Get the count of all users
  const totalFunders = await customer.find({ isFunder: true });

  console.log(totalFunders.length);
  // Get a random entry
  var random = Math.floor(Math.random() * totalFunders.length);

  return totalFunders[random];
}

async function getRandomBuyer() {
  //   let withdrawfakeAmount = faker.number.int({ min: 1, max: amount / 1000 });
  // Get the count of all users
  const totalBuyers = await customer.find({ isFunder: false });

  console.log(totalBuyers.length);
  // Get a random entry
  var random = Math.floor(Math.random() * totalBuyers.length);

  return totalBuyers[random];
}

async function getPoolSize() {
  const allBalnaces = await balance.find();
  // console.log(allBalnaces);
  return {
    fullBalance: allBalnaces.reduce((n, { FullBalance }) => n + FullBalance, 0),
    remainingBalance: allBalnaces.reduce(
      (n, { remainingBalance }) => n + remainingBalance,
      0
    ),
    usedBalance: allBalnaces.reduce((n, { usedBalance }) => n + usedBalance, 0),
    percentageUsed:
      (allBalnaces.reduce((n, { usedBalance }) => n + usedBalance, 0) /
        allBalnaces.reduce((n, { FullBalance }) => n + FullBalance, 0)) *
      100,
  };
}

async function createRandomPurchase() {
  const randomBuyer = await getRandomBuyer();
  let afterinvestAmount = faker.number.int({ min: 100, max: 4000 });
  let purchaseAmount = afterinvestAmount - afterinvestAmount * 0.1;

  // let purchaseAmount = faker.number.int({ min: 100, max: 4000 });

  const vv = 90000;
  const payoffAmount = 1000;
  const repayAmount = afterinvestAmount / 4;

  const poolSize = await getPoolSize();
  let poolBalance = poolSize.fullBalance;
  let investPercent = purchaseAmount / poolBalance;

  const allAvailableBalances = await balance.find({
    $expr: {
      $gte: [
        "$remainingBalance",
        {
          $multiply: ["$remainingBalance", investPercent],
        },
      ],
    },
  });

  // //get all balalces witth available percentage not with whole amount
  // const allAvailableBalances = await balance.find({
  //   remainingBalance: { $gte: purchaseAmount },
  // });

  const allIds = allAvailableBalances.map((obj) => {
    obj.id;
  });

  const totalPool = allAvailableBalances.reduce(
    (n, { remainingBalance }) => n + remainingBalance,
    0
  );
  const investPercentage = purchaseAmount / totalPool;
  console.log(purchaseAmount / totalPool);

  let NewPurchase = await purchase.create({
    madeBy: randomBuyer.id,
    fullAmount: purchaseAmount,
    afterinvestAmount: afterinvestAmount,
    paymentAmount: purchaseAmount / 4,
    investPerBalance: [],
    paidAmount: repayAmount,
    paymentsDone: 1,
    paymentsLeft: 3,
    paymentDates: [],
    nextDueDate: "11/11/11",
    stillOpen: true,
  });

  const allfrombalances = allAvailableBalances.map((obj) => ({
    madeBy: randomBuyer.id,
    investAmount: investPercentage * obj.remainingBalance,
    balanceValue: obj.remainingBalance,
    balance: obj.id,
    purchase: NewPurchase.id,
  }));

  const toUpdateInBalance = allAvailableBalances.map((obj) => ({
    _id: obj.id,
    investAmount: investPercentage * obj.remainingBalance,
    balanceValue: obj.remainingBalance,
    balance: obj.id,
    purchase: NewPurchase.id,
  }));

  const insertall = await investPerBalance.insertMany(allfrombalances);

  const allInvestIds = insertall.map((obj) => {
    console.log(obj.balance._id.toString());
    return obj.balance._id.toString();
  });
  // User.updateMany({"created": false}, {"$set":{"created": true}});
  console.log(allInvestIds);
  const eee = await balance.updateMany({ _id: { $in: allInvestIds } }, [
    {
      $set: {
        remainingBalance: {
          $subtract: [
            "$remainingBalance",
            { $multiply: ["$remainingBalance", investPercentage] },
          ], // this is 5 hours in ms
        },
        usedBalance: {
          $add: [
            "$usedBalance",
            { $multiply: ["$remainingBalance", investPercentage] },
          ],
        },
      },
    },
  ]);

  console.log(eee);

  // for await (const perbalance of allAvailableBalances) {
  //   let newinvestinbalance = await investPerBalance.create({
  //     madeBy: randomBuyer.id,
  //     investAmount: investPercentage * perbalance.remainingBalance,
  //     balanceValue: perbalance.remainingBalance,
  //     balance: perbalance.id,
  //     purchase: NewPurchase.id,
  //   });
  //   await balance.findOneAndUpdate(
  //     { _id: perbalance.id },
  //     {
  //       $inc: {
  //         remainingBalance: -(investPercentage * perbalance.remainingBalance),
  //         usedBalance: investPercentage * perbalance.remainingBalance,
  //       },
  //     }
  //   );
  //   console.log(newinvestinbalance);
  // }
  // await balance.updateMany(
  //   { _id: { $in: allIds } },
  //   { $inc: { remainingBalance: -purchaseAmount, usedBalance: purchaseAmount } }
  // );
  console.log("Done...");
  // console.log(investPercent);
  // console.log(allAvailableBalances);
  // console.log(allAvailableBalances[0].remainingBalance);
  // console.log(allAvailableBalances[0].remainingBalance * investPercentage);
  // const result = allAvailableBalances.map(({ name, height }) => ({
  //   name,
  //   height,
  // }));
  // console.log(result);

  // const allinvests = investPerBalance.insertMany(array);

  // for await (const perbalance of allAvailableBalances) {
  //   const allAvailableBalances = await balance.find({
  //     remainingBalance: { $gte: purchaseAmount },
  //   });
  //   console.log(perbalance.remainingBalance * investPercentage);
  // }

  // const array = [
  //   { firstName: "Jelly", lastName: "Bean" },
  //   { firstName: "John", lastName: "Doe" },
  // ];

  // Model.insertMany(array);

  // console.log(randomBuyer);
  // console.log(allAvailableBalances);

  // let NewPurchase = await purchase.create({
  //   madeBy: randomBuyer.id,
  //   fullAmount: purchaseAmount,
  //   paymentAmount: repayAmount,
  //   investPerBalance: allAvailableBalances,
  //   paidAmount: repayAmount,
  //   paymentsDone: 1,
  //   paymentsLeft: 3,
  //   paymentDates: [],
  //   nextDueDate: "11/11/11",
  //   stillOpen: true,
  // });

  // investPerBalance;

  // let fakeAmount = faker.number.int({ min: 1, max: 20 }) * 1000;

  // let newTransaction = await transaction.create({
  //   accountOwner: newUser.id,
  //   amount: amount,
  //   type: "deposit",
  //   balanceID: newBalance.id,
  // });

  // await balance.findOneAndUpdate(
  //   { _id: newBalance.id },
  //   {
  //     $push: { deposits: newTransaction },
  //     $inc: { FullBalance: amount },
  //   }
  // );

  // return newTransaction;
}

// for (i = 1; i <= 3; i++) {
//   (async function (i) {
//     setTimeout(async function () {
//       await runner();
//     }, 1000 * i);
//   })(i);
// }

async function runseeder() {
  var promises = [];

  for (var i = 0; i < 800; i++) {
    const promise = runner();
    promises.push(promise);
  }
  const array = await Promise.all(promises);
  return array;
}

(async () => {
  // console.log(await getPoolSize());
  await runseeder();
  // await getPoolSize();
  await createRandomPurchase();
  console.log("Main DONE!");
})();
async function runner() {
  let amount = faker.number.int({ min: 1, max: 20 }); //By Thousands
  let depositAmount = amount * 1000;
  let withdrawfakeAmount = faker.number.int({ min: 1, max: amount }) * 1000;

  const newUser = await createRandomUser();

  console.log(newUser);
  if (newUser.isFunder) {
    const newBalance = await createNewBalance(newUser);
    //
    const newDeposit = await createNewDeposit(
      newUser,
      newBalance,
      depositAmount
    );

    console.log(newBalance);
    console.log(newDeposit);
  }

  return;
  //   const newWithdrawl = await createNewWithdrawl(newUser, newBalance, withdrawfakeAmount);
}
