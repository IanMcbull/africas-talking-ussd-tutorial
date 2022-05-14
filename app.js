const express = require("express");
const app = express();
const colors = require("colors");
const db = require("./database/db");
const UssdMenu = require("ussd-builder");
require("dotenv").config();
const atCredentials = {
  apiKey: process.env.AT_SANDBOX_APIKEY,
  username: process.env.AT_SANDBOX_USERNAME
  };
const AfricasTalking = require("africastalking")(atCredentials);
const sms = AfricasTalking.SMS;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let menu = new UssdMenu();
menu.startState({
  run: () => {
    // use menu.con() to send response without terminating session
    menu.con(
      "Welcome! Ready to register for the Zizi Conference:" +
        "\n1. Get started" +
        "\n2. Get out!"
    );
  },
  // next object links to next state based on user input
  next: {
    1: "register",
    2: "quit",
  },
});
menu.state("register", {
  run: () => {
    menu.con("Before we go ahead, whats your name?");
  },
  next: {
    "*[a-zA-Z]+": "register.tickets",
  },
});
menu.state("register.tickets", {
  run: () => {
    let name = menu.val;
    dataToSave.name = name;
    console.log(dataToSave);
    menu.con("How many tickets would you like to reserve?");
  },
  next: {
    // using regex to match user input to next state
    "*\\d+": "end",
  },
});
menu.state("end", {
  run: async () => {
    let tickets = menu.val;
    dataToSave.tickets = tickets;
    console.log(dataToSave);
    // Save the data
    const data = new Model({
      name: dataToSave.name,
      tickets: dataToSave.tickets,
    });
    const dataSaved = await data.save();
    const options = {
      to: menu.args.phoneNumber,
      message: `Hi ${dataToSave.name}, we've reserved ${dataToSave.tickets} tickets for you.`
      }
      await sms.send(options);
    menu.end(
      "Awesome! We have your tickets reserved. Sending a confirmation text shortly."
    );
  },
});
menu.state("quit", {
  run: () => {
    menu.end("Goodbye :)");
  },
});
// Registering USSD handler with Express
app.post("/ussd", (req, res) => {
  menu.run(req.body, (ussdResult) => {
    res.send(ussdResult);
  });
});
db();

app.listen(9900, () => {
  console.log(`Listening on port: ${colors.yellow("9900")}`);
});