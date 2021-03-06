const inquirer = require('inquirer');
const fs = require('fs');
const dayjs = require('dayjs');
const path = require('path');
const Coin = require(path.join(__dirname, 'Coin.js'));
const error = require(path.join(__dirname, 'error.js'));
const ask = require(path.join(__dirname, 'ask.js'));

const saved = path.join(__dirname, '..', 'src', 'savedCoins.json');
const questions = [
  {
    name: 'investCash',
    type: 'number',
    message: 'How much cash have you invested in this coin?',
  },
  {
    name: 'investCoin',
    type: 'number',
    message: 'How many coins did that buy you?',
  },
  {
    name: 'mineable',
    type: 'confirm',
    message: 'Is this coin mineable?',
  },
  {
    when: (ans) => ans.mineable,
    name: 'mined',
    type: 'number',
    message: 'How many of these coins have you mined?',
  },
  {
    name: 'stake',
    type: 'confirm',
    message: 'Is this coin stakeable?',
  },
  {
    when: (ans) => ans.stake,
    name: 'rewards',
    type: 'number',
    message: 'How many coins have you earned in staking rewards?',
  },
];

const savedMsg = (coin) => {
  console.log(`Coin data saved. Use 'cointrack update ${coin}' to update totals.`);
};
const init = (coin) => {
  inquirer
    .prompt(questions)
    .then((ans) => {
      const date = dayjs().format('DD/MM/YY');
      const newCoin = new Coin(coin, ans.investCash, ans.investCoin,
        ans.mined, ans.rewards, 0, 0, date);
      if (fs.existsSync(saved)) {
        fs.readFile(path.join(__dirname, '..', 'src', 'savedCoins.json'), (err, data) => {
          error(err);
          const prev = JSON.parse(data);
          prev.push(newCoin);
          fs.writeFile(saved, JSON.stringify(prev), (e) => {
            error(e);
            savedMsg(coin);
          });
        });
      } else {
        fs.writeFile(saved, JSON.stringify([newCoin]), (err) => {
          error(err);
          savedMsg(coin);
        });
      }
    });
};
module.exports = init;
